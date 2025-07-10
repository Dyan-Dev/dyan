import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function boilerplate(language: "javascript" | "python") {
  const boilerplate = {
    javascript: `// Available: req, res, console, helpers
res.json({
  message: "Hello from Dyan!",
  method: req.method,
  path: req.path
});`,
    python: `# Not implemented yet
# Available: req, res
res.send("Python coming soon!")`,
  };
  return boilerplate[language];
}

export const validateJS = (code: string) => {
  try {
    // Wrap in function for validation, returns a function or throws
    new Function(`return (${code})`);
    return { valid: true };
  } catch (e: any) {
    return { valid: false, error: e.message };
  }
};
