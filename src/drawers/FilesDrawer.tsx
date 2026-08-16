// import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
// import GenericPanel from '@/components/generics/GenericPanel';
// import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
// import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
// import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
// import { GalleryPhoto } from '@/lib/galleryData';
// import { Box, Button, Typography } from '@mui/material';
// import { Folder } from 'lucide-react';
// import { useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Virtuoso } from 'react-virtuoso';

// type FileRow =
//   | {
//       type: 'folder';
//       key: string;
//       title: string;
//     }
//   | {
//       type: 'file';
//       key: string;
//       folder: string;
//       item: GalleryPhoto;
//     };

// export default function FilesDrawer() {
//   const unfilteredPhotos = useUnfilteredPhotos_GLOBAL();
//   const { setPreviewPhotoObj } = useSettings();
//   const navigate = useNavigate();
//   const width = useAlbumPhotoCardStoreSelector((state) => state.width);
//   const height = useAlbumPhotoCardStoreSelector((state) => state.height);
//   const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
//   const [closedFolders, setClosedFolders] = useState<Set<string>>(new Set());

//   const groupByFolder = (unfilteredPhotos || []).reduce((acc, photo) => {
//     const folder = photo.folder || 'Unknown';
//     if (!acc[folder]) {
//       acc[folder] = [];
//     }
//     acc[folder].push(photo);
//     return acc;
//   }, {} as Record<string, typeof unfilteredPhotos>);

//   const rows = useMemo<FileRow[]>(() => {
//     const result: FileRow[] = [];
//     for (const [folder, photos] of Object.entries(groupByFolder)) {
//       result.push({
//         type: 'folder',
//         key: `folder-${folder}`,
//         title: folder,
//       });

//       if (closedFolders.has(folder)) {
//         continue;
//       }

//       for (const photo of photos) {
//         result.push({
//           type: 'file',
//           key: `${folder}-${photo.id}`,
//           folder: folder,
//           item: photo,
//         });
//       }
//     }
//     return result;
//   }, [groupByFolder, closedFolders]);

//   const toggleAllFolders = () => {
//     if (closedFolders.size === 0) {
//       setClosedFolders(new Set(Object.keys(groupByFolder)));
//     } else {
//       setClosedFolders(new Set());
//     }
//   };

//   const multiplier = 5
//   const newHeight = Math.round(height / multiplier)
//   const newWidth = Math.round(width / multiplier)

//   return (
//     <GenericPanel id="files-drawer" tool={<>
//       <Button variant="outlined" size="small" onClick={toggleAllFolders}>
//         {closedFolders.size === 0 ? 'Close All Folders' : 'Open All Folders'}
//       </Button>
//     </>}>
//       <Virtuoso
//         data={rows}
//         computeItemKey={(_, row) => row.key}
//         itemContent={(_, row) => {

//           if (row.type === 'folder') {
//             return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//               <Folder size={16}  onClick={() => {
//                 setClosedFolders((prev) => {
//                   const newSet = new Set(prev);
//                   if (newSet.has(row.title)) {
//                     newSet.delete(row.title);
//                   } else {
//                     newSet.add(row.title);
//                   }
//                   return newSet;
//                 });
//               }} />
//               <Typography onClick={() => navigate('/selectedPhotos/' + 'folders' + '/' + encodeURIComponent(row.title))} variant="caption">{row.title}</Typography>
//             </Box>;
//           }

//           return <Box sx={{ cursor: 'pointer', ml: 1, display: 'flex', alignItems: 'center', gap: 1, borderLeft: '1px solid', borderColor: 'divider', pl: 2 }}
//             key={row.item.id}
//             onClick={() => {
//               navigate('/selectedPhotos/' + 'folders' + '/' + row.folder)
//               setPreviewPhotoObj(row.item);
//             }}
//           >
//             <Box sx={{ width: newWidth, height: newHeight, borderRadius: 1, overflow: 'hidden', flexShrink: 0, mb: 1 }} >
//               <AlbumPhotoThumbnailBackgroundNg
//                 photo={row.item}
//                 width={newWidth}
//                 height={newHeight}
//               />
//             </Box>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
//               <Typography title={JSON.stringify(row)} variant="caption" color={previewPhotoObj?.id === row.item.id ? 'primary' : 'textSecondary'}>{row.item.title}</Typography>
//               <Typography title={JSON.stringify(row)} variant="caption" color='textDisabled'>{row.item.width} x {row.item.height} | {row.item.takenAt}</Typography>
//             </Box>
//           </Box>;
//         }}
//       />
//     </GenericPanel>
//   );
// }
