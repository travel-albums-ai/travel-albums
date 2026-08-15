import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { Theme } from '@mui/material';

export default function Header() {
  return (
    <GeneralRegistryToolbar
      group="header"
      sx={{
        px: 1,
        pt: 0.75,
        pb: 0.75,
        bgcolor: 'background.default',
        borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`
      }}
    />
  );
}
