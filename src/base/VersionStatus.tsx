import { Tooltip, Typography } from '@mui/material';
import packageJson from '../../package.json';

export default function VersionStatus() {

  const version = packageJson.version;

  return (
    <Tooltip title={`Version: ${version}`} arrow>
      <Typography variant="caption" color="textPrimary">{version}</Typography>
    </Tooltip>
  )
}
