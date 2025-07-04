import { useState } from "react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Code,
  Settings,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Props {
  onChange: (data: { body: string; headers: string; query: string }) => void;
}

export function LiveIOPanel({ onChange }: Props) {
  const [body, setBody] = useState("{}");
  const [headers, setHeaders] = useState("{}");
  const [query, setQuery] = useState("{}");

  const [bodyValid, setBodyValid] = useState(true);
  const [headersValid, setHeadersValid] = useState(true);
  const [queryValid, setQueryValid] = useState(true);

  const validateJSON = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = () => {
    onChange({ body, headers, query });
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    setBodyValid(validateJSON(value));
    handleChange();
  };

  const handleHeadersChange = (value: string) => {
    setHeaders(value);
    setHeadersValid(validateJSON(value));
    handleChange();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setQueryValid(validateJSON(value));
    handleChange();
  };

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <Card className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
      <CardContent className="p-4">
        <Tabs defaultValue="body" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-slate-900/60">
            <TabsTrigger value="body" className="gap-2">
              <FileText className="w-4 h-4" />
              Body
              {!bodyValid && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="headers" className="gap-2">
              <Settings className="w-4 h-4" />
              Headers
              {!headersValid && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="query" className="gap-2">
              <Search className="w-4 h-4" />
              Query
              {!queryValid && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Code className="w-4 h-4" />
                Request Body
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  JSON
                </Badge>
                {getValidationIcon(bodyValid)}
              </div>
            </div>
            <Textarea
              className="font-mono text-sm min-h-[120px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                handleBodyChange(e.target.value);
              }}
            />
            {!bodyValid && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid JSON format
              </p>
            )}
          </TabsContent>

          <TabsContent value="headers" className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Request Headers
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  JSON
                </Badge>
                {getValidationIcon(headersValid)}
              </div>
            </div>
            <Textarea
              className="font-mono text-sm min-h-[80px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
              placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
              value={headers}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                handleHeadersChange(e.target.value);
              }}
            />
            {!headersValid && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid JSON format
              </p>
            )}
          </TabsContent>

          <TabsContent value="query" className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Query Parameters
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  JSON
                </Badge>
                {getValidationIcon(queryValid)}
              </div>
            </div>
            <Textarea
              className="font-mono text-sm min-h-[80px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
              placeholder='{"page": "1", "limit": "10", "filter": "active"}'
              value={query}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                handleQueryChange(e.target.value);
              }}
            />
            {!queryValid && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid JSON format
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
