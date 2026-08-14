import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type SettingToggleRowProps = {
  label: string,
  fieldLabel?: string,
  value: number
  onChange: (newValue: number) => void,
  disabled?: boolean
}

export default function SettingDateRow({
  label,
  fieldLabel,
  value,
  onChange,
  disabled = false
}: SettingToggleRowProps) {
  const [localValue, setLocalValue] = useState<dayjs.Dayjs | null>(value ? dayjs(value) : null)

  useEffect(() => {
    setLocalValue(value ? dayjs(value) : null)
  }, [value])

  return (
    <Box sx={boxSx}>
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1 }}>{label}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={fieldLabel}
          slots={disabled ? {
            openPickerIcon: () => <></>
          } : undefined}
          disabled={ disabled }
          value={localValue}
          onChange={(newVal) => {
            setLocalValue(newVal)
            const newValStr = newVal ? newVal.unix() * 1000 : ''
            if (newValStr !== value) onChange(Number(newValStr))
          }}
          slotProps={{
            textField: { size: 'small', margin: 'none', sx: { width: disabled ? 120 : 150 } },
          }}
        />
      </LocalizationProvider>
    </Box>
  )
}

const boxSx = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  p: 0.5,
  px: 0.75,
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  }
}
