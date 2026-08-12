import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useNegative, useNegativeStoreSelector } from '@/context/negativeStore';
import { GitGraph } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GeneticAlgoToggle() {
  const { setSetting } = useNegative()
  const { t } = useTranslation()
  const showGenetic = useNegativeStoreSelector((state) => state.showGenetic)

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleGeneticAlgorithm'),
      icon: <GitGraph />,
      onClick: () => setSetting((prev) => ({ ...prev, showGenetic: !prev.showGenetic })),
      selected: showGenetic,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
