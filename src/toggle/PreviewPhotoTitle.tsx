import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Typography } from '@mui/material';

export default function PreviewPhotoTitle() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return <Typography variant="caption" color="textSecondary">{`${previewPhotoObj?.title}`}</Typography>
}
