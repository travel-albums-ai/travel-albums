import { Box, Skeleton } from '@mui/material';

const BOX_SIZE = 42;
const COUNT = 12;

export default function NoPhotos() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 4,
        padding: '2rem',
        height: '100%',
      }}
    >
      <img
        src="./logo_new_240.webp"
        alt="Logo"
        width={120}
        height={98}
        fetchpriority="high"
        style={{
          aspectRatio: '1/1',
          opacity: 0.3,
          filter: 'grayscale(100%)',
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
        }}
      >
        {Array.from({ length: COUNT }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={BOX_SIZE}
            height={BOX_SIZE}
            sx={{
              opacity: 0.6,
              transform: 'scale(1)',
              animation: 'pulse 2.2s ease-in-out infinite',
              animationDelay: `${i * 0.12}s`,
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.4, transform: 'scale(0.95)' },
                '50%': { opacity: 0.8, transform: 'scale(1.05)' },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
