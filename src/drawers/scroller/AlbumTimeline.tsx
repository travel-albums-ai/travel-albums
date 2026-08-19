import { Box, Typography } from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';

import { GalleryPhoto } from '@/lib/galleryData';

type Props = {
  photos: GalleryPhoto[];
  rows?: number;
  columns?: number;
};

type TimelineMarker = {
  timestamp: number;
  label: string;
  type: 'year' | 'month';
  count: number;
};

export default function AlbumTimeline({ photos }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(0);

  const timeline = useMemo(() => {
    if (!photos.length) {
      return null;
    }

    const sorted = [...photos].sort(
      (a, b) => Number(a.takenAtTs) - Number(b.takenAtTs),
    );

    const minTs = Number(sorted[0].takenAtTs);
    const maxTs = Number(sorted[sorted.length - 1].takenAtTs);

    const range = Math.max(maxTs - minTs, 1);

    const months = new Map<string, number>();
    const years = new Map<number, number>();

    for (const photo of sorted) {
      const timestamp = Number(photo.takenAtTs);

      if (!Number.isFinite(timestamp)) {
        continue;
      }

      const date = new Date(timestamp * 1000);

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthKey = `${year}-${month}`;

      months.set(
        monthKey,
        (months.get(monthKey) ?? 0) + 1,
      );

      years.set(
        year,
        (years.get(year) ?? 0) + 1,
      );
    }

    const markers: TimelineMarker[] = [];

    for (const [key, count] of months) {
      const [yearString, monthString] = key.split('-');

      const year = Number(yearString);
      const month = Number(monthString);

      const timestamp =
        new Date(year, month, 1).getTime() / 1000;

      markers.push({
        timestamp,
        label: String(month + 1),
        type: 'month',
        count,
      });
    }

    for (const [year, count] of years) {
      markers.push({
        timestamp:
          new Date(year, 0, 1).getTime() / 1000,
        label: String(year),
        type: 'year',
        count,
      });
    }

    markers.sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    const getPosition = (timestamp: number) =>
      ((timestamp - minTs) / range) * 100;

    const getTimestamp = (percent: number) =>
      minTs + (range * percent) / 100;

    return {
      minTs,
      maxTs,
      range,
      markers,
      getPosition,
      getTimestamp,
    };
  }, [photos]);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!barRef.current || !timeline) {
        return;
      }

      const rect = barRef.current.getBoundingClientRect();

      const nextPosition =
        ((clientX - rect.left) / rect.width) * 100;

      setPosition(
        Math.max(0, Math.min(100, nextPosition)),
      );
    },
    [timeline],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(
        event.pointerId,
      );

      updateFromPointer(event.clientX);
    },
    [updateFromPointer],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        !event.currentTarget.hasPointerCapture(
          event.pointerId,
        )
      ) {
        return;
      }

      updateFromPointer(event.clientX);
    },
    [updateFromPointer],
  );

  if (!timeline) {
    return null;
  }

  const timestamp =
    timeline.getTimestamp(position);

  const selectedDate = new Date(timestamp * 1000);

  return (
    <Box
      sx={{
        width: '100%',
        px: 2,
        py: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 64,
        }}
      >
        {/* Timeline labels */}
        {timeline.markers.map((marker) => {
          const left =
            timeline.getPosition(marker.timestamp);

          const isYear =
            marker.type === 'year';

          return (
            <Box
              key={`${marker.type}-${marker.timestamp}`}
              sx={{
                position: 'absolute',
                left: `${left}%`,
                top: isYear ? 0 : undefined,
                bottom: !isYear ? 0 : undefined,
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: isYear ? 2 : 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: isYear ? 11 : 10,
                  fontWeight: isYear ? 700 : 400,
                  color: isYear
                    ? 'text.primary'
                    : 'text.secondary',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {marker.label}
              </Typography>
            </Box>
          );
        })}

        {/* Scrubber */}
        <Box
          ref={barRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 28,
            height: 8,
            bgcolor: 'divider',
            borderRadius: 999,
            cursor: 'pointer',
            touchAction: 'none',
          }}
        >
          {/* Handle */}
          <Box
            sx={{
              position: 'absolute',
              left: `${position}%`,
              top: '50%',
              width: 16,
              height: 28,
              transform: 'translate(-50%, -50%)',
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: 2,
              borderColor: 'text.primary',
              boxShadow: 2,
              cursor: 'grab',

              '&:active': {
                cursor: 'grabbing',
              },
            }}
          />
        </Box>
      </Box>

      {/* Current value */}
      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          color: 'text.secondary',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {selectedDate.getFullYear()}-
        {String(
          selectedDate.getMonth() + 1,
        ).padStart(2, '0')}
        -
        {String(
          selectedDate.getDate(),
        ).padStart(2, '0')}
      </Typography>
    </Box>
  );
}
