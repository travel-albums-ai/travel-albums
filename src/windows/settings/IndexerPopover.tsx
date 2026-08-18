import IndexerContent from '@/components/IndexerContent';
import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/usePost_Config';
import SettingsSection from '@/windows/components/SettingsSection';
import SettingsGeneralRow from '@/windows/settings/components/SettingsGeneralRow';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Code, Database, DatabaseSearch, Folder, FolderOpen, Trash } from 'lucide-react';
import { useState } from 'react';

export default function IndexerPopover() {
  const { data } = useFetch_Config()
  const { mutate } = usePost_Config()

  const [newRoot, setNewRoot] = useState('')
  const [targetRoot, setTargetRoot] = useState(data?.TARGET_ROOT || '')

  const deleteRoot = (root: string) => {
    const newRoots = data?.TAKEOUT_ROOTS?.filter((r: string) => r !== root) || []
    mutate({ TAKEOUT_ROOTS: newRoots })
  }

  const addRoot = (root: string) => {
    const newRoots = [...(data?.TAKEOUT_ROOTS || []), root]
    mutate({ TAKEOUT_ROOTS: newRoots })
  }

  const updateTargetRoot = (root: string) => {
    mutate({ TARGET_ROOT: root })
  }

  return <>
    <SettingsSection title="Path to cache and photos archive" icon={<Code />}>
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', mb: 1, flexDirection: 'column' }}>
          <SettingsGeneralRow icon={<Folder />} label="Takeout sources">
            <Box sx={{ width: '500px', display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'space-between' }}>
              {data?.TAKEOUT_ROOTS?.map((root: string) => (
                <Box key={root} sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', px: 1.5, py: 0.5, borderRadius: 2, opacity: 0.8, '&:hover': { opacity: 1, bgcolor: 'action.hover' } }}>
                  <FolderOpen size={16} />
                  {root}
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => deleteRoot(root)} size="small" variant="outlined" color="error">
                      <Trash size={16} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <TextField
                value={newRoot}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Folder size={16} />
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={(event) => setNewRoot(event.target.value)}
                onBlur={() => {
                  if (newRoot && !data?.TAKEOUT_ROOTS?.includes(newRoot)) {
                    addRoot(newRoot)
                    setNewRoot('')
                  }
                }}
              />
            </Box>
          </SettingsGeneralRow>

          <SettingsGeneralRow icon={<Database />} label="Cache">
            <Box sx={{ width: '500px', display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'space-between' }}>
              <TextField
                value={targetRoot}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Folder size={16} />
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={(event) => setTargetRoot(event.target.value)}
                onBlur={() => {
                  if (targetRoot) {
                    updateTargetRoot(targetRoot)
                  }
                }}
              />
            </Box>
          </SettingsGeneralRow>
        </Box>
      </>
    </SettingsSection>

    <SettingsSection title="Indexer" icon={<DatabaseSearch />}>
      <IndexerContent />
    </SettingsSection>
  </>
}
