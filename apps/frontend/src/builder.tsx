import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Settings, Play } from "lucide-react";
import SavedEndpointsSidebar from "../components/SavedEndpointsSidebar";
import type { Endpoint } from "../components/SavedEndpointsSidebar";
import Editor from "@monaco-editor/react";
import { LiveIOPanel } from "../components/LiveIOPanel";
import { boilerplate } from "../lib/utils";

export default function BuilderPage() {
  const [path, setPath] = useState("/api/hello");
  const [method, setMethod] = useState("GET");
  const [language, setLanguage] = useState<"javascript" | "python">(
    "javascript"
  );
  const [code, setCode] = useState(boilerplate[language]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );

  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [liveBody, setLiveBody] = useState("{}");
  const [liveHeaders, setLiveHeaders] = useState("{}");
  const [liveQuery, setLiveQuery] = useState("{}");

  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        const res = await fetch("prisma.user./dyan/endpoints", {
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
    const normalizedPath = path.replace(/^\/api/, "");

    const existing = endpoints.find(
      (ep) =>
        ep.path.replace(/^\/api/, "") === normalizedPath && ep.method === method
    );

    const methodType = existing ? "PUT" : "POST";

    const res = await fetch("prisma.user./dyan/endpoint", {
      method: methodType,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: normalizedPath, method, language, code }),
    });

    const data = await res.json();
    alert(existing ? "Endpoint updated!" : "Endpoint saved!");

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
  };

  const handleEdit = async (index: number) => {
    const ep = endpoints[index];
    setPath("/api" + ep.path);
    setMethod(ep.method);
    setLanguage(ep.language);

    try {
      const res = await fetch(
        `prisma.user./dyan/endpoint?path=${encodeURIComponent(ep.path)}&method=${ep.method}`, {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.code) setCode(data.code);
      setSelectedEndpoint(data);
    } catch {
      setCode(boilerplate[ep.language]);
    }
  };

  const handleDelete = async (index: number) => {
    const ep = endpoints[index];

    try {
      await fetch("prisma.user./dyan/endpoint", {
        method: "DELETE",
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
        setCode(boilerplate["javascript"]);
      }

      alert("Endpoint deleted");
    } catch (err) {
      alert("Failed to delete endpoint");
      console.error(err);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResponse(null);

    try {
      const queryParams = new URLSearchParams(JSON.parse(liveQuery)).toString();
      const targetUrl = `prisma.user.${path}${queryParams ? `?${queryParams}` : ""}`;

      const res = await fetch(targetUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...JSON.parse(liveHeaders),
        },
        body: method === "GET" ? undefined : liveBody,
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
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
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dyan: API Builder
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={handleTest}
              variant="outline"
              className="gap-1"
              disabled={!selectedEndpoint}
            >
              <Play className="w-4 h-4" />
              Test
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800 gap-1"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card className="p-4 space-y-4">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="path">Endpoint Path</Label>
                <Input
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="method">Method</Label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => {
                    const lang = e.target.value as "javascript" | "python";
                    setLanguage(lang);
                    setCode(boilerplate[lang]); // reset boilerplate when language changes
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="code">Logic</Label>
              <Editor
                height="300px"
                defaultLanguage="javascript"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
              />
            </div>

            <div>
              <Label>Live Input</Label>
              <LiveIOPanel
                onChange={({ body, headers, query }) => {
                  setLiveBody(body);
                  setLiveHeaders(headers);
                  setLiveQuery(query);
                }}
              />
            </div>

            <div>
              <Label>Live Response</Label>
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md min-h-[100px] max-h-[300px] overflow-auto border border-gray-700">
                {isTesting
                  ? "Testing..."
                  : (testResponse ?? "No response yet.")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
