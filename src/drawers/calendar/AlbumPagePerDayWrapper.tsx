import { useNearbyPlacesFromPhotos } from '@/hooks/useTransform_Photos2NearbyPlaces';
import { usePhotosByDay } from '@/hooks/useTransform_PhotosByDays';
import { useTransform_PhotosByMoments } from '@/hooks/useTransform_PhotosByMoments';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import { Box, Chip } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

export default function AlbumPagePerDayWrapper({ photos }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const photosByDay = usePhotosByDay(photos);
  const photosByMoments = useTransform_PhotosByMoments(photos);

  const days = useMemo(() => {
    return Object.values(photosByDay).slice();
  }, [photosByDay]);

  const day = selectedDay ? photosByDay.find((d) => d.label === selectedDay) : null;

  const uniquePlaces =  useNearbyPlacesFromPhotos(day?.photos || []);

  useEffect(() => {
    if(!selectedDay && days.length > 0) {
      setSelectedDay(days[0].label)
    }
  }, [days, selectedDay])

  console.log("xfdsfdsfsd", photosByMoments, photosByDay)

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

        {day && <Box sx={{ flex: '0 0 30%', maxWidth: 700, alignSelf: 'flex-start', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1, bgcolor: 'background.default', borderRadius: 2, p: 1, boxShadow: 2 }}>
            <DateCalendar value={dayjs(day.label)} disabled sx={{ m: 0 }} reduceAnimations />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '50%' }}>
              {uniquePlaces.reverse().map((place) => <Chip key={place} label={place} variant="outlined" />)}
            </Box>
             outdated
          </Box>


          <AlbumMapPanel photos={day.photos} height={550} interactive={true} />
        </Box>}

        <Box sx={{ flex: 1, minHeight: 0 }}>

          {photosByMoments.map((moment, index) => (
            <Box key={moment.label} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
              onMouseOver={() => setSelectedDay(moment.label)}
            >
              {moment.label}
              {moment.moments.map((day, index) => (
                <Box key={day.label} sx={{ display: 'flex', flexDirection: 'row', height: '100%', gap: 2, py: 4, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
                  onMouseOver={() => setSelectedDay(day.label)}
                >
                  {day.label}
                  {day.photos.length}

                </Box>
              ))}
            </Box>
          ))}



          {/* <Virtuoso
            style={{ height: '100%' }}
            totalCount={days.length}
            itemContent={(index) => (
              <Box sx={{
                // height: days[index].photos.length > 10 ? '100vh' : '50vh',
                height: '40vh',
              }}>
                <AlbumPagePerDayItem
                  setSelectedDay={setSelectedDay}
                  day={days[index]}
                  index={index}
                />
              </Box>
            )}
          /> */}

        </Box>
      </Box>
    </LocalizationProvider>
  );
}
