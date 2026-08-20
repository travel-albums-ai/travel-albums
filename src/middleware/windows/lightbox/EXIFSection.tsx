import { Box } from '@mui/material';


import PhotoExifComplete from '@/components/PhotoExifComplete';
import PhotoExifDetails from '@/components/PhotoExifDetails';
import SettingsSection from '@/components/SettingsSection';
import { GalleryPhoto } from '@/lib/galleryData';
import { Camera } from 'lucide-react';

export default function EXIFSection({ photo }: { photo: GalleryPhoto }) {
  if (!photo) return null;

  return (
    <>
      <SettingsSection title="EXIF" icon={<Camera />} gap={1} divider={false}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PhotoExifDetails photo={photo} />
          <Box sx={{ height: '350px', overflowY: 'auto', overflowX: 'hidden', width: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 2 }}>
            <PhotoExifComplete photo={photo} />
          </Box>
        </Box>
      </SettingsSection>
    </>
  );
}
