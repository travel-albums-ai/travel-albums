import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import peopleAndPetsWorker from '@/hooks/sections/workers/peopleGrouping.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { PersonStanding } from 'lucide-react';

export default function DashboardMetrics() {
  const photos = useFilteredPhotos_GLOBAL();
  const sectionPhotos = peopleAndPetsWorker(photos)

  return (
    <SettingsSection title="Metrics" icon={<PersonStanding />} >
      {photos.length} photos
    </SettingsSection>
  );
}
