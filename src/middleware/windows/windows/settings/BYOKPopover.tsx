import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { sectionIcons } from '@/icons/IconsIndex';
import SettingsSection from '@/middleware/windows/components/SettingsSection';
import BYOKPersona from '@/middleware/windows/settings/components/BYOKPersona';
import SettingFieldRow from '@/middleware/windows/settings/components/SettingFieldRow';
import { Box, Button, Typography } from '@mui/material';
import { Key, PersonStanding, Plus } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'byokOpenAIKey', icon: sectionIcons.peopleAndPets, labelKey: 'Open AI', value: 'show-people-and-pets', type: 'field' },
] as const

export default function BYOKPopover() {
  const { setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)
  const { getMainPersona, getAdditionalPersonas, addAdditionalPersona } = useBYOK()
  const { t } = useTranslation()

  return <>
    <SettingsSection title="Bring Your Own Key (BYOK)" icon={<Key />}>
      {toggleControls
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'field' &&   <SettingFieldRow
              icon={<Key size={16} />}
              key={control.key}
              label={t(control.labelKey)}
              value={byokStore[control.key]}
              onChange={(newValue) => setSetting(prev => ({ ...prev, [control.key]: newValue }))}
            />}
          </Fragment>
        ))}
    </SettingsSection>

    <SettingsSection title="AI identifiable personas" icon={<PersonStanding />}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2, justifyContent: 'space-between' }}>
        <Typography variant="subtitle2">Identify personas in photos</Typography>
        <Button variant="outlined" size="small" color="primary" onClick={() => addAdditionalPersona({ name: '', description: '' })}><Plus size={16} /></Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <BYOKPersona persona={getMainPersona()} main={true} index={0} />
        {getAdditionalPersonas().map((persona, index) => <BYOKPersona persona={persona} main={false} index={index} key={index} />)}
      </Box>
    </SettingsSection>
  </>
}
