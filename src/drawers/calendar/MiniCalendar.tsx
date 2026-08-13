import { Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  year: number
  month: number // 1-12
  highlightDays?: Dayjs[]
  selectedDay?: Dayjs
}

export default function MiniCalendar({
  year,
  month,
  highlightDays = [],
  selectedDay,
}: Props) {
  const first = dayjs().year(year).month(month - 1).date(1)
  const days = Array.from(
    { length: first.daysInMonth() },
    (_, i) => first.date(i + 1)
  )
  const offset = first.day() // Sunday = 0

  return (
    <Box sx={{ width: 280, p: 1.5 }}>
      <Typography fontWeight={600} textAlign="center" mb={1}>
        {first.format('MMMM YYYY')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: .5,
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Typography
            key={i}
            variant="caption"
            color="text.secondary"
            textAlign="center"
            fontWeight={600}
          >
            {d}
          </Typography>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <Box key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const highlighted = highlightDays.some(d => d.isSame(day, 'day'))
          const selected = selectedDay?.isSame(day, 'day')

          return (
            <Box
              key={day.date()}
              sx={{
                aspectRatio: '1',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  fontSize: 14,
                  fontWeight: selected || highlighted ? 600 : 400,
                  bgcolor: selected ? 'primary.main' : 'transparent',
                  color: selected
                    ? 'primary.contrastText'
                    : 'text.primary',
                  border: highlighted && !selected
                    ? '2px solid'
                    : 'none',
                  borderColor: 'primary.main',
                }}
              >
                {day.date()}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
