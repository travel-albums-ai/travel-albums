import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataView({ name, description, execute }) {
  useWebMCP({
    name,
    description,
    execute,
  });

  return null;
}
