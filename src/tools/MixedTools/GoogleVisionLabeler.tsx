// import GenericToggleButton from '@/components/generics/GenericToggleButton';
// import { useLabels } from '@/context/labelsStore';
// import { useSettingsStoreSelector } from '@/context/settingsStore';
// import { thumbnailUrl } from '@/lib/thumbnailService';
// import { Box, Typography } from '@mui/material';
// import { Binoculars } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// export default function GoogleVisionLabeler() {
//   const [loading, setLoading] = useState(false);
//   const photo = useSettingsStoreSelector((state) => state.previewPhotoObj)
//   const [preview, setPreview] = useState<string | null>(null);
//   const [autoAnalyze, setAutoAnalyze] = useState(false);
//   const { setLabelsFor } = useLabels()
//   const { t } = useTranslation()

//   const { byokGoogleVisionKey } = useSettingsStoreSelector((state) => state);
//   const GOOGLE_API_KEY = byokGoogleVisionKey;

//   const fileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         const result = reader.result as string;

//         const base64 = result.split(',')[1];
//         resolve(base64);
//       };

//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const analyzeImageFromUrl = async (url: string) => {
//     try {
//       const res = await fetch(url);
//       const blob = await res.blob();
//       const file = new File([blob], 'remote-image', { type: blob.type });

//       await analyzeImage(file);
//     } catch (err) {
//       console.error('Failed to fetch remote image', err);
//       alert(t('failedToLoadRemoteImage'));
//     }
//   };

//   const analyzeImage = async (file: File) => {
//     setLoading(true);

//     try {
//       const base64 = await fileToBase64(file);

//       const response = await fetch(
//         `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             requests: [
//               {
//                 image: {
//                   content: base64,
//                 },
//                 features: [
//                   {
//                     type: 'LABEL_DETECTION',
//                     maxResults: 20,
//                   },
//                 ],
//               },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();

//       const foundLabels =
//         data?.responses?.[0]?.labelAnnotations?.map((x: any) => ({
//           description: x.description,
//           score: x.score,
//         })) || [];

//       // setLabels(foundLabels);
//       setLabelsFor(photo?.id || 'undefined', foundLabels)
//     } catch (err) {
//       console.error(err);
//       alert(t('imageAnalysisFailed'));
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     if (!photo) return;

//     setPreview(thumbnailUrl(photo.id));

//     if (autoAnalyze) {
//       analyzeImageFromUrl(thumbnailUrl(photo.id));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [photo, autoAnalyze]);

//   useEffect(() => {
//     if (!autoAnalyze) return;

//     if (photo) {
//       analyzeImageFromUrl(thumbnailUrl(photo.id));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [autoAnalyze]);

//   return (
//     <div
//       style={{
//         fontFamily: 'sans-serif',
//         maxWidth: 700,
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <input
//               type="checkbox"
//               checked={autoAnalyze}
//               onChange={(e) => setAutoAnalyze(e.target.checked)}
//             />
//           Auto
//           </label>

//           {!autoAnalyze && preview && (
//             <>
//               <GenericToggleButton
//                 variant="outlined"
//                 item={{
//                   value: '',
//                   tooltip: t('byokGoogleVisionTooltip'),
//                   icon: <Binoculars size={16} />,
//                   onClick: () => {
//                     if (photo) analyzeImageFromUrl(thumbnailUrl(photo.id));
//                   },

//                 }}
//               />
//             </>
//           )}
//         </Box>

//         {loading && (
//           <Typography variant="caption" color="textSecondary">
//             {t('analyzingVisionApi')}
//           </Typography>
//         )}
//       </Box>
//     </div>
//   );
// }
