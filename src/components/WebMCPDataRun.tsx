import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataRun({ name, description, inputSchema, execute } : { name: string; description: string; inputSchema?: unknown; execute: (input: any) => Promise<any> }) {
  useWebMCP({
    name,
    description,
    inputSchema,
    execute,
  });

  return null;
}
