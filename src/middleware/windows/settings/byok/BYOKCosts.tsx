import SettingsSection from '@/components/SettingsSection';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { Box } from '@mui/material';
import { BoxIcon, Clock, Coins } from 'lucide-react';


export default function BYOKCosts() {
  const { usageStats } = useBYOKStoreSelector((state) => state)

  const totalInputTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.input_tokens || 0), 0) || 0;
  const totalOutputTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.output_tokens || 0), 0) || 0;
  const totalTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.total_tokens || 0), 0) || 0;


  return <>
    <SettingsSection title="Costs estimation" icon={<Coins />} transparent={true}>

      {usageStats?.map((usageStat, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5, p: 1, justifyContent: 'space-between' }}>
          <div><Clock size={16} /> {usageStat.created_at}</div>
          <div>Model: {usageStat.model}</div>
          <div>Input tokens: {usageStat.usage.input_tokens}</div>
          <div>Output tokens: {usageStat.usage.output_tokens}</div>
          <div><BoxIcon size={16} /> {usageStat.usage.total_tokens}</div>
        </Box>
      ))}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1, justifyContent: 'space-between' }}>
        <div>Total input tokens: {totalInputTokens}</div>
        <div>Total output tokens: {totalOutputTokens}</div>
        <div>Total tokens: {totalTokens}</div>
      </Box>
    </SettingsSection>


  </>
}
