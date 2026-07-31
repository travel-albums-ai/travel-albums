import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useNegative, useNegativeStoreSelector } from '@/context/negativeStore';
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
