import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Save,
  Play,
  LogOut,
  Code2,
  Globe,
  Settings,
  Zap,
  CheckCircle,
  Clock,
} from "lucide-react";
import SavedEndpointsSidebar from "../components/SavedEndpointsSidebar";
import type { Endpoint } from "../components/SavedEndpointsSidebar";
import Editor from "@monaco-editor/react";
import { LiveIOPanel } from "../components/LiveIOPanel";
import { boilerplate, validateJS } from "../lib/utils";

export default function BuilderPage() {
  const [path, setPath] = useState("/api/hello");
  const [method, setMethod] = useState("GET");
  const [language, setLanguage] = useState<"javascript" | "python">(
    "javascript"
  );
  const [code, setCode] = useState(boilerplate(language));
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );

  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [liveBody, setLiveBody] = useState("{}");
  const [liveHeaders, setLiveHeaders] = useState("{}");
  const [liveQuery, setLiveQuery] = useState("{}");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        const res = await fetch(`${apiUrl}/dyan/endpoints`, {
          credentials: "include",
        });
        const data = await res.json();
        setEndpoints(data);
      } catch (err) {
        console.error("Failed to load endpoints:", err);
      }
    };

    loadEndpoints();
  }, []);

  const handleSave = async () => {
    const jsCheck = validateJS(code);
    if (!jsCheck.valid) {
      alert(`Syntax Error: ${jsCheck.error}`);
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    try {
      const normalizedPath = path.replace(/^\/api/, "");

      const existing = endpoints.find(
        (ep) =>
          ep.path.replace(/^\/api/, "") === normalizedPath &&
          ep.method === method
      );

      const methodType = existing ? "PUT" : "POST";

      const res = await fetch(`${apiUrl}/dyan/endpoint`, {
        method: methodType,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: normalizedPath, method, language, code }),
      });

      await res.json();

      const newEp = { path, method, language };

      setEndpoints((prev) => {
        if (existing) {
          return prev.map((ep) =>
            ep.path === existing.path && ep.method === existing.method
              ? newEp
              : ep
          );
        } else {
          return [...prev, newEp];
        }
      });

      setSelectedEndpoint(newEp);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (index: number) => {
    const ep = endpoints[index];
    setPath("/api" + ep.path);
    setMethod(ep.method);
    setLanguage(ep.language);

    try {
      const res = await fetch(
        `${apiUrl}/dyan/endpoint?path=${encodeURIComponent(ep.path)}&method=${ep.method}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.code) setCode(data.code);
      setSelectedEndpoint(data);
    } catch {
      setCode(boilerplate(ep.language));
    }
  };

  const handleDelete = async (index: number) => {
    const ep = endpoints[index];

    try {
      await fetch(`${apiUrl}/dyan/endpoint`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: ep.path.replace(/^\/api/, ""),
          method: ep.method,
        }),
      });

      setEndpoints((prev) => prev.filter((_, i) => i !== index));
      if (
        selectedEndpoint?.path === ep.path &&
        selectedEndpoint.method === ep.method
      ) {
        setSelectedEndpoint(null);
        setPath("/api/hello");
        setMethod("GET");
        setLanguage("javascript");
        setCode(boilerplate("javascript"));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResponse(null);

    const jsCheck = validateJS(code);
    if (!jsCheck.valid) {
      setTestResponse(`Syntax Error: ${jsCheck.error}`);
      setIsTesting(false);
      return;
    }

    const parsedBody = JSON.parse(liveBody);
    const parsedQuery = JSON.parse(liveQuery);
    const parsedHeaders = JSON.parse(liveHeaders);

    try {
      const queryParams = new URLSearchParams(parsedQuery).toString();
      const targetUrl = `${apiUrl}${path}${queryParams ? `?${queryParams}` : ""}`;

      const res = await fetch(targetUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...parsedHeaders,
        },
        body: method === "GET" ? undefined : JSON.stringify(parsedBody),
      });

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setTestResponse(JSON.stringify(json, null, 2));
      } catch {
        setTestResponse(text);
      }
    } catch (err: any) {
      setTestResponse(`Error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/dyan/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "POST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "PUT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <SavedEndpointsSidebar
        endpoints={endpoints}
        onEdit={handleEdit}
        onDelete={handleDelete}
        setSelectedEndpoint={setSelectedEndpoint}
        setPath={setPath}
        setMethod={setMethod}
        setLanguage={setLanguage}
        setCode={setCode}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    API Builder
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Build and test your endpoints
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTest}
                  variant="outline"
                  size="sm"
                  disabled={!selectedEndpoint || isTesting}
                  className="gap-2"
                >
                  {isTesting ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isTesting ? "Testing..." : "Test"}
                </Button>

                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-slate-600 dark:text-slate-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Endpoint Configuration */}
          <Card className="shadow-sm border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Endpoint Configuration
                </CardTitle>
                {selectedEndpoint && (
                  <Badge className={getMethodColor(selectedEndpoint.method)}>
                    {selectedEndpoint.method}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="path"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Endpoint Path
                  </Label>
                  <Input
                    id="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="h-10"
                    placeholder="/api/your-endpoint"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">HTTP Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Language</Label>
                  <Select
                    value={language}
                    onValueChange={(value: "javascript" | "python") => {
                      setLanguage(value);
                      setCode(boilerplate(value));
                    }}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className="shadow-sm border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Function Logic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="350px"
                  defaultLanguage="javascript"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineHeight: 1.6,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Testing Panel */}
          <Card className="shadow-sm border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Test & Debug
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="response" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="input">Request Input</TabsTrigger>
                  <TabsTrigger value="response">Response Output</TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Request Configuration
                    </Label>
                    <LiveIOPanel
                      body={liveBody}
                      headers={liveHeaders}
                      query={liveQuery}
                      onChange={({ body, headers, query }) => {
                        setLiveBody(body);
                        setLiveHeaders(headers);
                        setLiveQuery(query);
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Response</Label>
                      {testResponse && !isTesting && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Response received
                        </div>
                      )}
                      {isTesting && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          <Clock className="w-3 h-3 animate-pulse" />
                          Testing...
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg min-h-[150px] max-h-[400px] overflow-auto border border-slate-700">
                      {isTesting
                        ? "🔄 Executing request..."
                        : testResponse
                          ? testResponse
                          : "💡 Click 'Test' to see the response output here"}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
