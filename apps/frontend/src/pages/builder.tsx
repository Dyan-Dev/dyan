import { useState } from 'react';

const BuilderPage = () => {
  const [path, setPath] = useState('/example');
  const [method, setMethod] = useState('GET');
  const [logic, setLogic] = useState(`return res.json({ msg: "Hello!" });`);
  const [generated, setGenerated] = useState('');

  const handleGenerate = async () => {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, method, logic })
    });
    const data = await res.text();
    setGenerated(data);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">🛠️ Build Your API</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="/your-path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-full border rounded p-2"
        />

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <textarea
          rows={5}
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
          placeholder="Write your logic here"
          className="w-full border rounded p-2 font-mono"
        />

        <button
          onClick={handleGenerate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Generate Code
        </button>
      </div>

      {generated && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">🧾 Generated NestJS Controller</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{generated}</pre>
        </div>
      )}
    </div>
  );
};

export default BuilderPage;
