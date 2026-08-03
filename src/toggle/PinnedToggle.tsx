import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePinned, usePinned_isPinned } from '@/context/pinnedStore';
import { Pin, PinOff } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function PinnedToggle() {
  const { type_name = '', id = '' } = useParams()
  const { add, remove } = usePinned()
  const isPinned = usePinned_isPinned({ type_name, id })

  return <GenericToggleButtonGroup items={[
    {
      tooltip: 'Toggle pin',
      icon: isPinned ? <Pin /> : <PinOff />,
      onClick: () => isPinned ? remove({ type_name, id }) : add({ type_name, id }),
      selected: isPinned,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
