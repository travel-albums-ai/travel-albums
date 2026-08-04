import GenericToggleButton from '@/components/generics/GenericToggleButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Key, PanelLeftClose } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BYOKGoogleVisionField() {
  const { setSetting } = useSettings();
  const { byokGoogleVisionKey, byokGoogleVisionOpen } = useSettingsStoreSelector((state) => state);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState(byokGoogleVisionKey ?? '');

  const commit = (value: string) => {
    setSetting(prev => ({
      ...prev,
      byokGoogleVisionKey: value,
    }));
  };

  const handleChange = (value: string) => {
    setSearchTerm(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      commit(value);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      commit(searchTerm);
    }
  };

  useEffect(() => {
    setSearchTerm(byokGoogleVisionKey ?? '');
  }, [byokGoogleVisionKey]);

  return (
    <>
      {(byokGoogleVisionOpen) ? (
        <>
          <TextField
            placeholder={t('googleVisionApiKeyPlaceholder')}
            variant="outlined"
            size="small"
            autoFocus
            type="password"
            value={searchTerm}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">
                  <Key size={16} />
                </InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => {
                    setSetting(prev => ({ ...prev, byokGoogleVisionOpen: false }));
                  }} size="small">
                    <PanelLeftClose size={16} />
                  </IconButton>
                </InputAdornment>,
              },
            }}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </>
      ) : (<>
        <GenericToggleButton
          variant="outlined"
          item={{
            value: byokGoogleVisionKey,
            tooltip: t('byokGoogleVisionTooltip'),
            icon: <Key size={16} />,
            onClick: () => setSetting(prev => ({ ...prev, byokGoogleVisionOpen: true })),
            selected: !!byokGoogleVisionKey,
          }}
        />
      </>)}
    </>
  );
}
