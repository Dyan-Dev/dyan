import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Settings,
  Code2,
  Layers,
  Globe,
} from "lucide-react";
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

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "POST":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "PUT":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
      case "DELETE":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getLanguageIcon = (language: string) => {
    return language === "python" ? "🐍" : "⚡";
  };

  return (
    <div className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Endpoints
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {endpoints.length} saved endpoint{endpoints.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Endpoints List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {endpoints.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                No endpoints yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Create your first endpoint to get started
              </p>
            </div>
          ) : (
            endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium ${getMethodColor(ep.method)}`}
                      >
                        {ep.method}
                      </Badge>
                      <span className="text-xs">
                        {getLanguageIcon(ep.language)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {ep.path}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {ep.language}
                    </p>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(idx)}
                      className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      title="Edit endpoint"
                    >
                      <Pencil className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(idx)}
                      className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete endpoint"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-dashed"
          onClick={() => {
            setSelectedEndpoint?.(null);
            setPath?.("/api/");
            setMethod?.("GET");
            setLanguage?.("javascript");
            setCode?.(boilerplate("javascript"));
          }}
        >
          <PlusCircle className="w-4 h-4" />
          Create New Endpoint
        </Button>
      </div>
    </div>
  );
}
