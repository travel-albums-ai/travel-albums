import { useBYOKStoreSelector } from '@/context/byokStore';
import { useSettings } from '@/context/settingsStore';
import { sectionIcons } from '@/icons/IconsIndex';
import SettingFieldRow from '@/settings/components/SettingFieldRow';
import { Box, Stack } from '@mui/material';
import { Key } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'byokGoogleVisionKey', icon: sectionIcons.trips, labelKey: 'Google Vision', value: 'show-trips', type: 'field' },
  { key: 'byokOpenAIKey', icon: sectionIcons.peopleAndPets, labelKey: 'Open AI', value: 'show-people-and-pets', type: 'field' },
] as const

export default function BYOKPopover() {
  const { setModule } = useSettings()
  const byokStore = useBYOKStoreSelector((state) => state)
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
    </Stack>
  </>
}
