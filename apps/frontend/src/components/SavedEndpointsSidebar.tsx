// File: apps/frontend/components/SavedEndpointsSidebar.tsx

import { Button } from "../components/ui/button";
import { PlusCircle, Pencil, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import { boilerplate } from "../lib/utils";

export interface Endpoint {
  path: string;
  method: string;
  language: "javascript" | "python";
}

interface SidebarProps {
  endpoints: Endpoint[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  setSelectedEndpoint?: (endpoint: Endpoint | null) => void;
  setPath?: (path: string) => void;
  setMethod?: (method: string) => void;
  setLanguage?: (language: "javascript" | "python") => void;
  setCode?: (code: string) => void;
}

export default function SavedEndpointsSidebar({
  endpoints,
  onEdit,
  onDelete,
  setSelectedEndpoint,
  setPath,
  setMethod,
  setLanguage,
  setCode,
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4 hidden md:block">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Endpoints
        </h2>
        <Settings
          className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black"
          onClick={() => setShowSettings(!showSettings)}
        />
      </div>

      <div className="space-y-2">
        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
              {ep.method} {ep.path}
            </span>
            <div className="flex gap-1">
              <span title="Edit">
                <Pencil
                  className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => onEdit(idx)}
                />
              </span>
              <span title="Delete">
                <Trash2
                  className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => onDelete(idx)}
                />
              </span>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full justify-start text-gray-700 dark:text-white"
          onClick={() => {
            setSelectedEndpoint?.(null);
            setPath?.("/api/");
            setMethod?.("GET");
            setLanguage?.("javascript");
            setCode?.(boilerplate("javascript"));
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>
    </div>
  );
}
