import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import AlbumPagePerDayItem from '@/drawers/calendar/AlbumPagePerDayItem';
import MiniCalendar from '@/drawers/calendar/MiniCalendar';
import { useTransform_PhotosByMoments } from '@/hooks/useTransform_PhotosByMoments';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import DayAnalyzer from '@/robot/DayAnalyzer';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function AlbumPagePerDayWrapper({ photos }: { photos: any[] }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const photosByMoments = useTransform_PhotosByMoments(photos);
  const descriptionStore = useDescriptionsStoreSelector(state => state.descriptions);

  const selectedPhotos = (selectedDay && selectedMoment && selectedPlace) ? photosByMoments.find((d) => d.label === selectedDay)?.moments.find((m) => m.label === selectedMoment)?.locations.find((l) => l.label === selectedPlace)?.photos : null;

  const allMoments = photosByMoments.flatMap((day) => day.moments.flatMap((moment) => day.label + ", " + moment.label));

  const uniquePlaces =  [...new Set(selectedPhotos?.map(p => p?.city).map(c => c?.name))]

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="section"
        aria-label="Photos in album"
        sx={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          gap: 2
        }}
      >

        <Box sx={{ flex: '0 0 30%', maxWidth: 700, alignSelf: 'flex-start', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1, bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 2 }}>

            <MiniCalendar
              year={dayjs(selectedDay).year()}
              month={dayjs(selectedDay).month() + 1}
              highlightMoments={[
                ...allMoments.map((moment) => dayjs(moment)),
              ]}
              selectedDay={dayjs(selectedDay)}
              selectedMoment={dayjs(selectedDay + ", " + selectedMoment)}
            />

            <DayAnalyzer
              key={`${selectedDay} ${selectedMoment} at ${selectedPlace}`}
              context={{
                descriptions: (selectedPhotos || [])
                  .map(photo => descriptionStore.find(d => d.id === photo.id))
                  .filter(d => d !== undefined)
                  .map(d => d.description),
                location: uniquePlaces.join(', '),
              }} />
          </Box>

          {selectedPhotos && <AlbumMapPanel photos={selectedPhotos} height={550} interactive={true} />}
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>

          <Box sx={{ overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, pt: 2, px: 1 }}>
            {photosByMoments.map((day, index) => (
              <Box key={day.label} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
                onMouseOver={() => setSelectedDay(day.label)}
              >
                📅 {day.label}
                {day.moments.map((moment) => (
                  <Box key={moment.label} onMouseOver={() => setSelectedMoment(moment.label)}>
                    {moment.locations.map((location, index) => (
                      <Box key={location.label}
                        onMouseOver={() => setSelectedPlace(location.label)}
                        sx={{
                          display: 'flex', flexDirection: 'row',
                          gap: 2, py: 2,
                          pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap',
                        }}>
                        <Box sx={{
                          width: '100%',
                          height: (location.photos.length / 10 + 1) * 25 + 'vh',
                        }}>
                          <AlbumPagePerDayItem
                            day={{ label: `${day.label} ${moment.label} at ${location.label} (${location.photos.length})`, photos: location.photos }}
                            index={index}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
