import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataView({ name, description, execute }: { name: string; description: string; execute: (input: any) => Promise<any> }) {
  useWebMCP({
    name,
    description,
    execute,
  });

  return null;
}
