import { Box, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GalleryPhoto } from '@/lib/galleryData';

type Props = {
  photos: GalleryPhoto[];
  chunkSize: number;
  onIndexChange?: (index: number, chunkIndex: number) => void;
  currentChunk?: number;
  rows?: number;
  columns?: number;
};

type TimelineMarker = {
  timestamp: number;
  label: string;
  type: 'year' | 'month';
  count: number;
};

export default function AlbumTimeline({
  photos,
  chunkSize = 6,
  onIndexChange,
  currentChunk,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  // 0 = latest, 100 = oldest
  const [position, setPosition] = useState(0);

  const timeline = useMemo(() => {
    if (!photos.length) {
      return null;
    }

    // IMPORTANT:
    // Timeline and indexes are both newest -> oldest.
    const sorted = [...photos]
      .filter((photo) =>
        Number.isFinite(Number(photo.takenAtTs)),
      )
      .sort(
        (a, b) =>
          Number(b.takenAtTs) - Number(a.takenAtTs),
      );

    if (!sorted.length) {
      return null;
    }

    const maxTs = Number(sorted[0].takenAtTs);
    const minTs = Number(
      sorted[sorted.length - 1].takenAtTs,
    );

    const range = Math.max(maxTs - minTs, 1);

    const months = new Map<string, number>();
    const years = new Map<number, number>();

    for (const photo of sorted) {
      const timestamp = Number(photo.takenAtTs);
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

    // Month markers
    for (const [key, count] of months) {
      const [yearString, monthString] = key.split('-');

      const year = Number(yearString);
      const month = Number(monthString);

      markers.push({
        timestamp:
          new Date(year, month, 1).getTime() / 1000,
        label: String(month + 1),
        type: 'month',
        count,
      });
    }

    // Year markers
    for (const [year, count] of years) {
      markers.push({
        timestamp:
          new Date(year, 0, 1).getTime() / 1000,
        label: String(year),
        type: 'year',
        count,
      });
    }

    // Newest -> oldest
    markers.sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    /**
     * Convert timestamp to timeline position.
     *
     * 0%   = newest
     * 100% = oldest
     */
    const getPosition = (timestamp: number) =>
      100 - ((timestamp - minTs) / range) * 100;

    /**
     * Convert timeline position back to timestamp.
     *
     * 0%   = newest timestamp
     * 100% = oldest timestamp
     */
    const getTimestamp = (percent: number) =>
      maxTs - (range * percent) / 100;

    /**
     * Find the actual photo index closest to a timestamp.
     *
     * `sorted` is newest -> oldest, so binary search
     * accordingly.
     */
    const getPhotoIndex = (timestamp: number) => {
      let low = 0;
      let high = sorted.length - 1;

      while (low < high) {
        const mid = Math.floor(
          (low + high) / 2,
        );

        const midTs = Number(
          sorted[mid].takenAtTs,
        );

        if (midTs > timestamp) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }

      // Check neighbouring photo too, so we return the
      // genuinely closest photo rather than merely the
      // first one crossing the timestamp.
      const index = low;

      if (index === 0) {
        return 0;
      }

      const currentDistance = Math.abs(
        Number(sorted[index].takenAtTs) -
          timestamp,
      );

      const previousDistance = Math.abs(
        Number(sorted[index - 1].takenAtTs) -
          timestamp,
      );

      return previousDistance <= currentDistance
        ? index - 1
        : index;
    };

    return {
      sorted,
      minTs,
      maxTs,
      range,
      markers,
      getPosition,
      getTimestamp,
      getPhotoIndex,
    };
  }, [photos]);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!barRef.current || !timeline) {
        return;
      }

      const rect =
        barRef.current.getBoundingClientRect();

      const nextPosition =
        ((clientX - rect.left) / rect.width) * 100;

      const clampedPosition = Math.max(
        0,
        Math.min(100, nextPosition),
      );

      setPosition(clampedPosition);

      const timestamp =
        timeline.getTimestamp(
          clampedPosition,
        );

      const index =
        timeline.getPhotoIndex(timestamp);

      const chunkIndex =
        Math.floor(index / chunkSize);

      onIndexChange?.(
        index,
        chunkIndex,
      );
    },
    [
      timeline,
      chunkSize,
      onIndexChange,
    ],
  );

  // When parent scroller changes current chunk, update the timeline
  // scrubber position to match.
  useEffect(() => {
    if (typeof currentChunk !== 'number' || !timeline) return;

    const index = Math.min(
      timeline.sorted.length - 1,
      currentChunk * chunkSize,
    );

    const ts = Number(timeline.sorted[index].takenAtTs);
    const pos = timeline.getPosition(ts);

    setPosition(pos);
  }, [currentChunk, timeline, chunkSize]);

  const handlePointerDown = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      event.currentTarget.setPointerCapture(
        event.pointerId,
      );

      updateFromPointer(event.clientX);
    },
    [updateFromPointer],
  );

  const handlePointerMove = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
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

  const selectedDate =
    new Date(timestamp * 1000);

  const selectedIndex =
    timeline.getPhotoIndex(timestamp);

  const selectedChunk =
    Math.floor(
      selectedIndex / chunkSize,
    );

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
        {/* Timeline markers */}
        {timeline.markers.map((marker) => {
          const left =
            timeline.getPosition(
              marker.timestamp,
            );

          const isYear =
            marker.type === 'year';

          return (
            <Box
              key={`${marker.type}-${marker.timestamp}`}
              sx={{
                position: 'absolute',
                left: `${left}%`,
                top: isYear ? 0 : 20,
                // bottom: !isYear ? 0 : undefined,
                transform:
                  'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: isYear ? 2 : 1,
              }}
            >


              {isYear && <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {marker.label}
              </Typography>}

              {!isYear && <Box sx={{ width: '0.5px', height: '8px', bgcolor: 'text.secondary'}}></Box>}

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
          <Tooltip title={selectedDate.toDateString()} placement="bottom" arrow open={true}>
            <Box
              sx={{
                position: 'absolute',
                left: `${position}%`,
                top: '50%',
                width: 16,
                height: 28,
                transform:
                'translate(-50%, -50%)',
                borderRadius: 2,
                bgcolor:
                'background.paper',
                border: 2,
                borderColor:
                'text.primary',
                boxShadow: 2,
                cursor: 'grab',

                '&:active': {
                  cursor: 'grabbing',
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Current position */}
      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          color: 'text.secondary',
          fontVariantNumeric:
            'tabular-nums',
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
        {' · '}
        #{selectedIndex.toLocaleString()}
        {' · '}
        chunk {selectedChunk.toLocaleString()}
      </Typography>
    </Box>
  );
}
