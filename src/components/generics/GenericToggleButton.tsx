import KeyboardChip from '@/components/KeyboardChip';
import PopoverButtonSimple from '@/components/PopoverButtonSimple';
import GenericHotkey from '@/components/generics/GenericHotkey';
import { Box, ToggleButton, Tooltip, Typography, useTheme } from '@mui/material';
import { Astroid, ChevronDown, ChevronUp } from 'lucide-react';
import { cloneElement, ReactElement, ReactNode } from 'react';

export interface GenericToggleButtonProps {
  id?: string;
  webMcp?: boolean;
  group?: string[];
  tooltip: string;
  kbd?: string;
  icon: ReactNode;
  onClick?: (e) => void;
  selected?: boolean;
  value?: string | number | boolean,
  title?: string,
  disabled?: boolean,
  // showArrow?: boolean,
  upsideDown?: boolean,
  popover?: ReactNode,
  meta?: {
    name: string;
    description: string;
    icon: ReactNode;
    group: string;
  }
}

export default function GenericToggleButton({
  item,
  variant,
  size = 16,
  dropShadow = false,
}: {
  item: GenericToggleButtonProps,
  variant?: 'standard' | 'outlined',
  size?: number,
  dropShadow?: boolean
  }) {
  const theme = useTheme();

  const buttonDOM = <>
    {item.kbd && !item.disabled && <GenericHotkey item={item as any} />}
    <Tooltip title={<Box sx={{ display: 'flex', p: 0.125, alignItems: 'center', gap: 0.5 }}>
      {item.webMcp && <Astroid size={12} />}
      {item.tooltip}
      {item.kbd && !item.disabled && <KeyboardChip shortcut={item.kbd} />}</Box>
    } placement="bottom" arrow>
      <span>
        <ToggleButton
          style={{ display: 'flex', alignItems: 'center', gap: 2, border: 0 }}
          sx={variant === 'outlined'
            ? {
              borderRadius: 2,
              boxShadow: theme => `inset 0px 0px 0px 1px ${theme.palette.divider}`
            }
            : {
              borderRadius: 2,
            }}
          value={item.value || item.tooltip}
          selected={item.disabled ? false : item.selected}
          disabled={item.disabled}
          onClick={item.onClick}
        >
          {item.icon && cloneElement(item.icon as ReactElement, {
            ...item.icon.props,
            size,
            style: dropShadow ? {
              ...item.icon.props.style,
              color: theme.palette.text.primary,
              filter: "drop-shadow(0px 2px 2px rgba(0,0,0,1))"
            } : {
              ...item.icon.props.style,
              color: theme.palette.text.primary,
            } })}
          {item.title && <Typography variant="caption" color="textPrimary" sx={{ ml: 0.5, lineHeight: 1 }}>{item.title}</Typography>}

          {item.popover && <>
            {item.upsideDown
              ?  <ChevronUp size={12} color={theme.palette.text.primary} />
              : <ChevronDown size={12} color={theme.palette.text.primary} />}
          </>}
        </ToggleButton>
      </span>
    </Tooltip>
  </>

  return <>
    {!item.popover && buttonDOM}

    {item.popover && <PopoverButtonSimple trigger={<span>{buttonDOM}</span>} >
      {item.popover}
    </PopoverButtonSimple>}
  </>
}
