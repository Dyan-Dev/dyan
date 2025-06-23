interface EndpointFormProps {
  path: string;
  setPath: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
  language: 'javascript' | 'python';
  setLanguage: (lang: 'javascript' | 'python') => void;
}

export default function EndpointForm({
  path,
  setPath,
  method,
  setMethod,
  language,
  setLanguage,
}: EndpointFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Endpoint Path</label>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'javascript' | 'python')}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
    </div>
  );
}
