import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';

import GenericPanel from '@/components/generics/GenericPanel';
import { Delete, Expand, Folder } from 'lucide-react';

type FolderFile = {
  name: string;
  path: string;
  extension: string;
  size: number;
  file: File;
};

type FolderHandler = {
  id: string;
  name: string;
  files: FolderFile[];
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

export default function FolderHandlersDrawer() {
  const [folders, setFolders] = useState<FolderHandler[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFolder = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const grouped = new Map<string, FolderHandler>();

    for (const file of files) {
      const relativePath = (file as File & { webkitRelativePath: string }).webkitRelativePath;

      const folderName = relativePath.split('/')[0] || 'Folder';

      if (!grouped.has(folderName)) {
        grouped.set(folderName, {
          id: crypto.randomUUID(),
          name: folderName,
          files: [],
        });
      }

      grouped.get(folderName)!.files.push({
        name: file.name,
        path: relativePath,
        extension: file.name.split('.').pop()?.toUpperCase() ?? '',
        size: file.size,
        file,
      });
    }

    setFolders((prev) => [...prev, ...grouped.values()]);

    // Allow selecting the same folder again later
    event.target.value = '';
  };

  const removeFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <GenericPanel id="folder-handlers-drawer" defaultToolbar>
      <Stack
        spacing={2}
        sx={{
          height: '100%',
          p: 2,
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Folder />}
            onClick={() => inputRef.current?.click()}
          >
            Add Folder
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            disabled={!folders.length}
            onClick={() => setFolders([])}
          >
            Clear
          </Button>
        </Stack>

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
            overflow: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {!folders.length && (
            <Typography color="text.secondary">
              No folders added.
            </Typography>
          )}

          {folders.map((folder) => {
            const totalSize = folder.files.reduce((sum, file) => sum + file.size, 0);

            return (
              <Accordion
                key={folder.id}
                defaultExpanded
                disableGutters
              >
                <AccordionSummary expandIcon={<Expand />}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    width="100%"
                    pr={2}
                  >
                    <Stack spacing={0.5}>
                      <Typography >
                        📁 {folder.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {folder.files.length} files • {formatBytes(totalSize)}
                      </Typography>
                    </Stack>

                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFolder(folder.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </AccordionSummary>
              </Accordion>
            );
          })}
        </Box>
      </Stack>
    </GenericPanel>
  );
}
