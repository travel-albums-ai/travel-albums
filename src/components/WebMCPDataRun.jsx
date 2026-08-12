import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataRun({ name, description, inputSchema, execute }) {
  useWebMCP({
    name,
    description,
    inputSchema,
    execute,
  });

  return null;
}
