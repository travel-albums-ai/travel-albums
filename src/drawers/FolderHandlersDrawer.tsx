import { Box, Button } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';

import GenericPanel from '@/components/generics/GenericPanel';

export default function FolderHandlersDrawer() {
  const [folders, setFolders] = useState<Map<string, number>>(() => new Map());

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFolder = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    // Copy existing map so we can update counts in-place and trigger a single state update
    const next = new Map(folders);

    for (let i = 0; i < files.length; i++) {
      const file = files[i] as File & { webkitRelativePath?: string };
      const path = file.webkitRelativePath ?? file.name;
      const slash = path.indexOf('/');
      const folder = slash === -1 ? path : path.slice(0, slash);

      next.set(folder, (next.get(folder) ?? 0) + 1);
    }

    setFolders(next);

    event.target.value = '';
  };

  console.log('folders', folders);

  return (
    <GenericPanel id="folder-handlers-drawer" defaultToolbar>
      <Box
        sx={{
          p: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => inputRef.current?.click()}
          >
            Add Folder
          </Button>

          <Button
            color="error"
            disabled={folders.length === 0}
            onClick={() => setFolders([])}
          >
            Clear
          </Button>
        </Box>

        <input
          ref={inputRef}
          hidden
          type="file"
          multiple
          //@ts-ignore
          webkitdirectory=""
          onChange={handleAddFolder}
        />

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          {folders.size === 0 ? (
            <div>No folders added.</div>
          ) : (
            Array.from(folders.entries()).map(([name, count], i, arr) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 0.5,
                  px: 1,
                  borderBottom:
                    i === arr.length - 1
                      ? undefined
                      : '1px solid rgba(255,255,255,.08)',
                }}
              >
                <div>{name}</div>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <div>{count} files</div>

                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      setFolders(prev => {
                        const copy = new Map(prev);
                        copy.delete(name);
                        return copy;
                      })
                    }
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </GenericPanel>
  );
}
