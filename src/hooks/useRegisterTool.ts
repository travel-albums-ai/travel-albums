import { useEffect } from 'react';

type ToolConfig<T = unknown> = {
  name: string;
  description?: string;
  inputSchema?: unknown;
  execute: (args: T) => Promise<any> | any;
};

export default function useRegisterTool<T>(
  config: ToolConfig<T>,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const modelContext = (document as any).modelContext;

    if (!modelContext?.registerTool) {
      console.log('ModelContext API not available');
      return;
    }

    let dispose: (() => void) | undefined;

    (async () => {
      try {
        dispose = await modelContext.registerTool({
          name: config.name,
          description: config.description,
          inputSchema: config.inputSchema,
          execute: config.execute,
        });

        console.log(`Registered "${config.name}"`);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      dispose?.();
    };
  }, deps);
}
