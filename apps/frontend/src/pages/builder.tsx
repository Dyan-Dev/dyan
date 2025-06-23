// File: apps/frontend/pages/builder.tsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Settings } from "lucide-react";
import SavedEndpointsSidebar from "../components/SavedEndpointsSidebar";
import type { Endpoint } from "../components/SavedEndpointsSidebar";
import { EndpointTester } from "../components/EndpointTester";
import { ResponseModal } from "../components/ResponseModal";

export default function BuilderPage() {
  const [path, setPath] = useState("/api/hello");
  const [method, setMethod] = useState("GET");
  const [language, setLanguage] = useState<"javascript" | "python">(
    "javascript"
  );
  const [code, setCode] = useState("// Write your logic here");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalResponse, setModalResponse] = useState("");
  const [modalEndpoint, setModalEndpoint] = useState("");
  const [modalMethod, setModalMethod] = useState("");

  const handleSave = async () => {
    const normalizedPath = path.replace(/^\/api/, '');

    const res = await fetch("http://localhost:3000/api/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: normalizedPath, method, language, code }),
    });
    const data = await res.json();
    console.log(data);
    alert("Endpoint saved!");
    const newEndpoint = { path, method, language };
    setEndpoints((prev) => [...prev, newEndpoint]);
    setSelectedEndpoint(newEndpoint);
  };

  const handleEdit = (index: number) => {
    const ep = endpoints[index];
    setPath(ep.path);
    setMethod(ep.method);
    setLanguage(ep.language);
  };

  const handleDuplicate = (index: number) => {
    const ep = endpoints[index];
    const dup = { ...ep, path: ep.path + "-copy" };
    setEndpoints((prev) => [...prev, dup]);
  };

  const handleDelete = (index: number) => {
    setEndpoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTest = async (ep: Endpoint) => {
    try {
      const res = await fetch(`http://localhost:3000${ep.path}`, {
        method: ep.method,
      });

      const resultText = await res.text(); // Support non-JSON too
      setModalEndpoint(ep.path);
      setModalMethod(ep.method);
      setModalResponse(resultText);
      setModalOpen(true);
    } catch (err: any) {
      setModalEndpoint(ep.path);
      setModalMethod(ep.method);
      setModalResponse(`Error: ${err.message}`);
      setModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <SavedEndpointsSidebar
        endpoints={endpoints}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onTest={handleTest}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dyan: API Builder
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Save className="w-4 h-4 mr-2" /> Save Endpoint
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
                  onChange={(e) =>
                    setLanguage(e.target.value as "javascript" | "python")
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="code">Logic</Label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tester */}
        {selectedEndpoint && (
          <EndpointTester
            method={selectedEndpoint.method}
            path={selectedEndpoint.path}
          />
        )}
      </div>
      <ResponseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        endpoint={modalEndpoint}
        method={modalMethod}
        response={modalResponse}
      />
    </div>
  );
}
