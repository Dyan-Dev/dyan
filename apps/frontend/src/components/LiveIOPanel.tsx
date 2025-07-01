// File: apps/frontend/components/LiveIOPanel.tsx
import { useState } from "react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

interface Props {
  onChange: (data: { body: string; headers: string; query: string }) => void;
}

export function LiveIOPanel({ onChange }: Props) {
  const [body, setBody] = useState('{}');
  const [headers, setHeaders] = useState('{}');
  const [query, setQuery] = useState('{}');

  const handleChange = () => {
    onChange({ body, headers, query });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Body (JSON)</Label>
        <Textarea
          className="font-mono text-sm"
          rows={4}
          value={body}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setBody(e.target.value);
            handleChange();
          }}
        />
      </div>
      <div>
        <Label>Headers (JSON)</Label>
        <Textarea
          className="font-mono text-sm"
          rows={2}
          value={headers}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setHeaders(e.target.value);
            handleChange();
          }}
        />
      </div>
      <div>
        <Label>Query Params (JSON)</Label>
        <Textarea
          className="font-mono text-sm"
          rows={2}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setQuery(e.target.value);
            handleChange();
          }}
        />
      </div>
    </div>
  );
}
