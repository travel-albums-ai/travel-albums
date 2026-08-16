import { useBYOK } from '@/context/byokStore';
import { useEffect } from 'react';
import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataRun({ name, description, inputSchema, execute, deps } : { name: string; description: string; inputSchema?: any, execute: (input: any) => Promise<any>; deps?: any[] }) {

  const { registerTool } = useBYOK();

  useEffect(() => {
    registerTool({
      name,
      description,
      inputSchema: inputSchema || {
        type: 'object',
        properties: {},
      },
      execute,
    });
  }, [name, description, inputSchema, execute]);

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
