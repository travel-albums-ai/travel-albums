import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { supportedLanguages, type SupportedLanguage } from '@/lib/i18n';
import GenericToggleButton, { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import { ToggleButtonGroup } from '@mui/material';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
};

const LANGUAGE_TOOLTIPS: Record<SupportedLanguage, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};

const ITEMS = supportedLanguages.map((lang) => ({
  value: lang,
  tooltip: LANGUAGE_TOOLTIPS[lang],
  title: LANGUAGE_LABELS[lang],
  icon: null,
})) as GenericToggleButtonProps[];

export default function LocaleToggle() {
  const { setSetting } = useSettings();
  const locale = useSettingsStoreSelector((state) => state.locale);

  return (
    <ToggleButtonGroup
      value={locale}
      exclusive
      onChange={(_, newLocale: SupportedLanguage) => {
        if (newLocale) {
          setSetting((prev) => ({ ...prev, locale: newLocale }));
        }
      }}
    >
      {ITEMS.map((item) => (
        <GenericToggleButton key={String(item.value)} item={item} variant="outlined" />
      ))}
    </ToggleButtonGroup>
  );
}
