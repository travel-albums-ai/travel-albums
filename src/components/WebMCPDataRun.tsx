import { useWebMCP } from 'usewebmcp';

export default function WebMCPDataRun({ name, description, inputSchema, execute, deps } : { name: string; description: string; inputSchema?: any, execute: (input: any) => Promise<any>; deps?: any[] }) {

  // const { registerTool, hasRegisteredTool } = useBYOK();

  // useEffect(() => {
  //   if (hasRegisteredTool(name)) {
  //     return;
  //   }
  //   registerTool({
  //     name,
  //     description,
  //     inputSchema: inputSchema || {
  //       type: 'object',
  //       properties: {},
  //     },
  //     execute,
  //   });
  // }, []);

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
