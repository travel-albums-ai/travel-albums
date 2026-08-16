import SolidChip from '@/components/SolidChip';
import packageJson from '../../package.json';

export default function VersionStatus() {

  const version = packageJson.version;

  return (
    <SolidChip
      count={version}
      label={"Version"}
      variant="text"
      tooltip={`Version: ${version}`}
    />
  )
}
