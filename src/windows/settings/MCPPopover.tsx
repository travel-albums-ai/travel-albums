import { useBYOK } from '@/context/byokStore';
import SettingsSection from '@/windows/components/SettingsSection';
import { Key } from 'lucide-react';


export default function MCPPopover() {
  const { getRegisteredTools } = useBYOK()

  console.log('Registered tools:', getRegisteredTools());

  return <>
    <SettingsSection title="Bring Your Own Key (BYOK)" icon={<Key />}>
     dsfds
    </SettingsSection>
  </>
}
