import SettingsSection from '@/components/SettingsSection';
import SolidChip from '@/components/SolidChip';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { Box, Typography } from '@mui/material';
import { Astroid, BoxIcon, Clock, Coins, LogIn, LogOut } from 'lucide-react';


export default function BYOKCosts() {
  const { usageStats } = useBYOKStoreSelector((state) => state)

  const totalInputTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.input_tokens || 0), 0) || 0;
  const totalOutputTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.output_tokens || 0), 0) || 0;
  const totalTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.total_tokens || 0), 0) || 0;

  const convertToHumanReadable = (date: number) => {
    const dateObj = new Date(date * 1000); // Convert seconds to milliseconds
    return dateObj.toLocaleString(); // Format the date to a human-readable string
  };

  return <>
    <SettingsSection title="Costs estimation" icon={<Coins />} transparent={true} uuid="byok-costs">

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1, justifyContent: 'space-between', height: '300px', overflowY: 'auto' }}>

        {usageStats?.map((usageStat, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5, p: 0.25, justifyContent: 'space-between', flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" color="textDisabled">{index}.</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 0.25, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <SolidChip label={`${usageStat.model} model`} icon={<Astroid size={16} />} fontSize={13} height={24} minWidth={150} />
                <SolidChip label={`${convertToHumanReadable(Number(usageStat.created_at))}`} icon={<Clock size={16} />} borderless />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              {usageStat.service_tier && <SolidChip label={`${usageStat.service_tier} tier`} icon={<Coins size={16} />} fontSize={13} />}
              {usageStat.call_type && <SolidChip label={`${usageStat.call_type}`} icon={<BoxIcon size={16} />} fontSize={13} />}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'space-between' }}>
                <SolidChip count={usageStat.usage.input_tokens} label={`K Input`} icon={<LogIn size={16} />} />
                <SolidChip count={usageStat.usage.output_tokens} label={`K Output`} icon={<LogOut size={16} />} />
              </Box>
              <SolidChip count={usageStat.usage.total_tokens} label={`K tokens`} icon={<BoxIcon size={16} />} fontSize={13} />
            </Box>
          </Box>
        ))}

      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, p: 1, flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
        <SolidChip count={totalInputTokens} label={`K Input`} icon={<LogIn size={16} />} />
        <SolidChip count={totalOutputTokens} label={`K Output`} icon={<LogOut size={16} />} />
        <SolidChip count={totalTokens} label={`K Total tokens`} icon={<BoxIcon size={16} />} fontSize={13} />



        {/* <div>Total input tokens: {totalInputTokens}</div> */}
        {/* <div>Total output tokens: {totalOutputTokens}</div> */}
        {/* <div>Total tokens: {totalTokens}</div> */}
      </Box>
    </SettingsSection>


  </>
}
