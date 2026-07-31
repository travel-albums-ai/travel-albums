import { useNegative, useNegativeStoreSelector } from '@/context/negativeStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { GitGraph } from 'lucide-react';

export default function GeneticAlgoToggle() {
  const { setSetting } = useNegative()
  const showGenetic = useNegativeStoreSelector((state) => state.showGenetic)

  return <GenericToggleButtonGroup items={[
    {
      tooltip: 'Toggle Genetic Algorithm',
      icon: <GitGraph />,
      onClick: () => setSetting((prev) => ({ ...prev, showGenetic: !prev.showGenetic })),
      selected: showGenetic,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
