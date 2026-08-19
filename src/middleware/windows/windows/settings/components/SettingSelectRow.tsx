import { Box, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type SettingSelectRowProps = {
  label: string;
  value: string;
  options: string[];

  onChange: (newValue: string) => void;

  disabled?: boolean;
  placeholder?: string;
};

export default function SettingSelectRow({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder,
}: SettingSelectRowProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <Box sx={boxSx}>
      <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
        {label}
      </Typography>

      <Select
        value={localValue}
        onChange={handleChange}
        size="small"
        variant="outlined"
        disabled={disabled}
        displayEmpty={!!placeholder}
        sx={{ width: 350 }}
      >
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

const boxSx = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  p: 0.75,
  px: 1,
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  },
};
