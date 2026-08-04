import LoadingBar from '@/layout/StatusBar/components/LoadingBar';
import DomCountStatus from '@/layout/StatusBar/DomCountStatus';
import GenerateThumbnailsStatus from '@/layout/StatusBar/GenerateThumbnailsStatus';
import KeyboardMenu from '@/layout/StatusBar/KeyboardMenu';
import ServerStatus from '@/layout/StatusBar/ServerStatus';
import SystemStatus from '@/layout/StatusBar/SystemStatus';
import ThumbSizeStatus from '@/layout/StatusBar/ThumbSizeStatus';
import VersionStatus from '@/layout/StatusBar/VersionStatus';
import { Box, Divider, Stack, Theme } from '@mui/material';
import { Fragment } from 'react';

export default function StatusBar() {
  const pages = [
    {
      key: "indexStatus",
      dom: <SystemStatus />,
    },
    {
      key: "domCount",
      dom: <DomCountStatus />,
      secondary: true
    },
    {
      key: "thumbSize",
      dom: <ThumbSizeStatus />,
      secondary: true
    },
    {
      key: "generateThumbnails",
      dom: <GenerateThumbnailsStatus />,
      secondary: true
    },
    {
      key: "serverStatus",
      dom: <ServerStatus />,
      secondary: true
    },
    {
      key: 'keyboardMenu',
      dom: <KeyboardMenu />,
      secondary: true
    },
    {
      key: 'versionStatus',
      dom: <VersionStatus />,
      secondary: true
    },
  ]

  const pagesGroups = [
    pages.filter(page => page.secondary !== true),
    pages.filter(page => page.secondary === true)
  ]

  return (
    <Box sx={wrapperSx} id="status-bar">
      <LoadingBar />

      {pagesGroups.map((group, index) => <Stack
        key={`group_${index}`}
        direction="row"
        sx={{ alignItems: 'center' }}
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        {group.map(page => <Fragment key={ page.key}>{page.dom && page.dom}</Fragment>)}
      </Stack>)}
    </Box>
  )
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1.5,
  px: 1.25,
  py: 0.5,
  bgcolor: 'background.default',
  position: 'relative',
  borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
}
