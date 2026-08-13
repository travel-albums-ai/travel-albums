import { usePhotosByDay } from '@/hooks/useTransform_PhotosByDays';
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';
import { Box, Divider, Typography } from '@mui/material';
import { Calendar } from 'lucide-react';

export default function AlbumPagePerDayItem({ day, index, setSelectedDay }: { day: ReturnType<typeof usePhotosByDay>[number], index: number, setSelectedDay: (day: string | null) => void }) {

  return (
    <Box key={day.label} id="AlbumPagePerDayItem"
      sx={{ display: 'flex', flexDirection: 'row', height: '100%', gap: 2, py: 4, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
      onMouseOver={() => setSelectedDay(day.label)}
    >
      <Box sx={{ width: '100%' }}>
        <Divider sx={{ mb: 2 }} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} />
            <Typography variant="caption" sx={{ lineHeight: 1 }} color="textDisabled"> {day.label}</Typography>
          </Box>
        </Divider>
        <AllPhotosGridVirtuoso photos={day.photos} />
      </Box>
    </Box>
  )
}
