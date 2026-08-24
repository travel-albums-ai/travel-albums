import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import SettingsSection from '@/components/SettingsSection';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import SettingsGeneralRow from '@/middleware/windows/settings/components/SettingsGeneralRow';
import { Astroid, Key, Turtle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'enableAI', labelKey: 'Open AI', value: 'show-people-and-pets', type: 'boolean', icon: <Astroid size={16} /> },
  { key: 'byokOpenAIKey', labelKey: 'Open AI Key', value: 'show-people-and-pets', type: 'field', icon: <Key size={16} /> },
] as const

export default function BYOKOpenAi() {
  const { setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)
  const { getMainPersona, getAdditionalPersonas, addAdditionalPersona } = useBYOK()
  const { t } = useTranslation()

  return <>
    <SettingsSection title="Open AI" icon={<Key />} transparent={true}>

      <SettingsGeneralRow icon={<Astroid />} label="Model">
        <SegmentedControl defaultValue="normal" onChange={(_, value) => console.log('change', value)}>
          <SegmentedControlItem value="gpt-5.6-sol" >GPT 5.6 Sol</SegmentedControlItem>
          <SegmentedControlItem value="gpt-5.6-terra" >GPT 5.6 Terra</SegmentedControlItem>
          <SegmentedControlItem value="gpt-5.6-luna" >GPT 5.6 Luna</SegmentedControlItem>
        </SegmentedControl>
      </SettingsGeneralRow>

      <SettingsGeneralRow icon={<Turtle />} label="Priority">
        <SegmentedControl defaultValue="normal" onChange={(_, value) => console.log('change', value)}>
          <SegmentedControlItem value="normal" >Normal</SegmentedControlItem>
          <SegmentedControlItem value="low" >Low Priority</SegmentedControlItem>
          <SegmentedControlItem value="fast" >Fast</SegmentedControlItem>
        </SegmentedControl>
      </SettingsGeneralRow>

      {/* {toggleControls
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              icon={control.icon}
              label={t(control.labelKey)}
              selected={byokStore[control.key]}
              onChange={() => {
                console.log('toggle', control.key, !byokStore[control.key])
                setSetting(prev => ({ ...prev, [control.key]: !prev[control.key] }))
              }}
            />}
            {control.type === 'field' &&   <SettingFieldRow
              icon={control.icon}
              key={control.key}
              label={t(control.labelKey)}
              value={byokStore[control.key]}
              onChange={(newValue) => setSetting(prev => ({ ...prev, [control.key]: newValue }))}
            />}
          </Fragment>
        ))} */}
    </SettingsSection>


  </>
}
