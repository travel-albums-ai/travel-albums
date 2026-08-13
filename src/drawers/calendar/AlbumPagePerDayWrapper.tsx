import AlbumPagePerDayItem from '@/drawers/calendar/AlbumPagePerDayItem';
import { usePhotosByDay } from '@/hooks/useTransform_PhotosByDays';
import { useTransform_PhotosByMoments } from '@/hooks/useTransform_PhotosByMoments';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function AlbumPagePerDayWrapper({ photos }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const photosByDay = usePhotosByDay(photos);
  const photosByMoments = useTransform_PhotosByMoments(photos);

  const selectedPhotos = (selectedDay && selectedMoment && selectedPlace) ? photosByMoments.find((d) => d.label === selectedDay)?.moments.find((m) => m.label === selectedMoment)?.locations.find((l) => l.label === selectedPlace)?.photos : null;


  // const days = useMemo(() => {
  //   return Object.values(photosByDay).slice();
  // }, [photosByDay]);

  const day = (selectedDay && selectedMoment && selectedPlace) ? photosByMoments.find((d) => d.label === selectedDay) : null;

  // const uniquePlaces =  useNearbyPlacesFromPhotos(day?.photos || []);

  // useEffect(() => {
  //   if(!selectedDay && days.length > 0) {
  //     setSelectedDay(days[0].label)
  //   }
  // }, [days, selectedDay])

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
            {selectedPhotos?.length}
            {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '50%' }}>
              {uniquePlaces.reverse().map((place) => <Chip key={place} label={place} variant="outlined" />)}
            </Box> */}
            {/* outdated */}
          </Box>


          {selectedPhotos && <AlbumMapPanel photos={selectedPhotos} height={550} interactive={true} />}
        </Box>}

        <Box sx={{ flex: 1, minHeight: 0 }}>

          <Box sx={{ overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, pt: 2, px: 1 }}>
            {photosByMoments.map((day, index) => (
              <Box key={day.label} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
                onMouseOver={() => setSelectedDay(day.label)}
              >
                📅 {day.label}
                {day.moments.map((moment, index) => (
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
                          // minHeight: '20vh',
                          height: (location.photos.length / 10 + 1) * 20 + 'vh',
                        }}>
                          <AlbumPagePerDayItem
                            setSelectedDay={() => {}}
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
