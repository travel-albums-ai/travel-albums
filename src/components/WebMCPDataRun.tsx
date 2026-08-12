import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataRun({ name, description, inputSchema, execute, deps } : { name: string; description: string; inputSchema?: any, execute: (input: any) => Promise<any>; deps?: any[] }) {
  useWebMCP({
    name,
    description,
    inputSchema: inputSchema || {
      type: 'object',
      properties: {},
    },
    execute,
  }, deps || []);

  return null;
}
