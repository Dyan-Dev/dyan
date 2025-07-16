import { useState } from "react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import jsonlint from 'jsonlint-mod'
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
  body: string;
  headers: string;
  query: string;
  onChange: (data: { body: string; headers: string; query: string }) => void;
}

export function LiveIOPanel({ body, headers, query, onChange }: Props) {

  const [bodyError, setBodyError] = useState<{ error: string, line: number, column: number } | null>(null);
  const [headersError, setHeadersError] = useState<{ error: string, line: number, column: number } | null>(null);
  const [queryError, setQueryError] = useState<{ error: string, line: number, column: number } | null>(null);



  function validateJSONWithDetails(value: string) {
    try {
      jsonlint.parse(value);
      return { valid: true, error: null, line: null, column: null };
    } catch (e: any) {
      // jsonlint-mod error messages include line/column
      return {
        valid: false,
        error: e.message,
        line: e.line,
        column: e.column,
      };
    }
  }


  const handleBodyChange = (value: string) => {
    const result = validateJSONWithDetails(value);
    setBodyError(result.valid ? null : result);
    onChange({ body: value, headers, query });
  };

  const handleHeadersChange = (value: string) => {
    setHeadersError(validateJSONWithDetails(value));
    onChange({ body, headers: value, query });
  };

  const handleQueryChange = (value: string) => {
    setQueryError(validateJSONWithDetails(value));
    onChange({ body, headers, query: value });
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
              {bodyError && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="headers" className="gap-2">
              <Settings className="w-4 h-4" />
              Headers
              {headersError && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="query" className="gap-2">
              <Search className="w-4 h-4" />
              Query
              {queryError && (
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
                {getValidationIcon(!bodyError)}
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
            {bodyError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {bodyError.error} (Line {bodyError.line}, Column {bodyError.column})
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
                {getValidationIcon(!headersError)}
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
            {headersError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {headersError.error} (Line {headersError.line}, Column {headersError.column})
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
                {getValidationIcon(!queryError)}
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
            {queryError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {queryError.error} (Line {queryError.line}, Column {queryError.column})
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
