import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import AlbumPhotoThumbnailBackground from '@/components/AlbumPhotoThumbnailBackground';
import {
  indexPhotos,
  searchPhotos,
  type Photo,
} from './photoSemanticSearch';

type Props = {
  apiKey: string
  photos: Photo[]
}

export default function SemanticPhotoSearch({
  apiKey,
  photos,
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<
    Awaited<ReturnType<typeof searchPhotos>>
  >([])
  const [indexing, setIndexing] = useState(false)

  const handleIndex = async () => {
    setIndexing(true)

    try {
      await indexPhotos(apiKey, photos)
    } finally {
      setIndexing(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    const results = await searchPhotos(
      apiKey,
      query,
    )

    setResults(results)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Button
        onClick={handleIndex}
        disabled={indexing}
      >
        {indexing ? 'Indexing...' : 'Index photos'}
      </Button>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          placeholder="Search photos semantically..."
        />

        <Button onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        {results
          .filter(result => result.score > 0.3)
          .map(result => (
            <Box
              key={result.id}
              sx={{
                py: 1,
                display: 'flex',
                gap: 2,
                borderBottom: '1px dotted',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ maxWidth: '100px', maxHeight: '100px', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 1 }}>
                <AlbumPhotoThumbnailBackground
                  imageUrl={result.id}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexGrow: 1 }}>

                <Typography variant="body2">
                  {result.id}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {result.description}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                Score: {result.score.toFixed(3)}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  )
}
