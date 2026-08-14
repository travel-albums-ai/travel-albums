import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useSettings } from '@/context/settingsStore';
import { sectionIcons } from '@/icons/IconsIndex';
import BYOKPersona from '@/modals/settings/components/BYOKPersona';
import SettingFieldRow from '@/modals/settings/components/SettingFieldRow';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Key, Plus } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'byokGoogleVisionKey', icon: sectionIcons.trips, labelKey: 'Google Vision', value: 'show-trips', type: 'field' },
  { key: 'byokOpenAIKey', icon: sectionIcons.peopleAndPets, labelKey: 'Open AI', value: 'show-people-and-pets', type: 'field' },
] as const

export default function BYOKPopover() {
  const { setModule } = useSettings()
  const byokStore = useBYOKStoreSelector((state) => state)
  const { getMainPersona, getAdditionalPersonas, addAdditionalPersona } = useBYOK()
  const { t } = useTranslation()

  return <>
    <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
      {toggleControls
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'field' &&   <SettingFieldRow
              icon={<Key size={16} />}
              key={control.key}
              label={t(control.labelKey)}
              value={byokStore[control.key]}
              onChange={(newValue) => setModule(control.key, newValue)}
            />}
          </Fragment>
        ))}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2, justifyContent: 'space-between' }}>
        <Typography variant="subtitle2">Identify personas in photos</Typography>
        <Button variant="outlined" color="primary" onClick={() => addAdditionalPersona({ name: '', description: '' })}><Plus /></Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <BYOKPersona persona={getMainPersona()} main={true} index={0} />
        {getAdditionalPersonas().map((persona, index) => <BYOKPersona persona={persona} main={false} index={index} key={index} />)}
      </Box>

    </Stack>
  </>
}
