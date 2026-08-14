import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Section } from '@/hooks/sections/useTransform_AllSections';
import SidebarCoreButton from '@/layout/components/SidebarCoreButton';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SidebarSectionItem({ section, item, type, icon }: {  section: Section, item: any, type: string, icon: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarCoreButton
      sx={{ pr: 4.25, py: 2 }}
      onClick={() => navigate('/selectedPhotos/' + type + '/' + encodeURIComponent(item.name))}
      typographySx={{ opacity: 0.75 }}
      title={item.name}
      beforeSlot={section.preview === true ? <>
        {section.type === 'peopleAndPets' && <Box sx={{ width: 16, height: 16, flex: '0 0 16px', borderRadius: 10, overflow: 'hidden' }}>
          {/* <AlbumPhotoThumbnailBackground imageUrl={item.photos[0].id} tiny={item.photos[0].tiny} /> */}
          <AlbumPhotoThumbnailBackgroundNg photo={item.photos[0]} />
        </Box>}
        {section.type === 'tags' && <Box sx={{ width: 16, height: 16, flex: '0 0 16px', borderRadius: 10, overflow: 'hidden', backgroundColor: item.color }} />}
        {(section.type === 'countries' || section.type === 'places' || section.type === 'cities') && <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />}
      </> : undefined}
      icon={section.preview !== true ? icon : undefined}
      isActive={decodeURIComponent(location.pathname) === `/selectedPhotos/${type}/${item.name}`}
      count={item.photos?.length}
    />
  );
}
