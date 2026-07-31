import { useFavorites } from '@/context/favoritesStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { Star, StarOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FavoriteToggle({ photoId }: { photoId: string }) {
  const { isFavorite, add, remove } = useFavorites()
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleFavorite'),
      icon: isFavorite(photoId) ? <Star fill="currentColor" /> : <StarOff />,
      onClick: () => isFavorite(photoId) ? remove(photoId) : add(photoId),
      selected: isFavorite(photoId),
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
