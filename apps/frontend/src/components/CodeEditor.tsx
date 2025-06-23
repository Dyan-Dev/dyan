import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

type Props = {
  language: "javascript" | "python";
  value: string;
  onChange: (code: string) => void;
};

export const CodeEditor = ({ language, value, onChange }: Props) => {
  const extensions = language === "javascript" ? [javascript()] : [python()];

  return (
    <div className="border rounded-md overflow-hidden">
      <CodeMirror
        value={value}
        height="200px"
        extensions={extensions}
        theme="dark"
        onChange={(val) => onChange(val)}
      />
    </div>
  );
};
