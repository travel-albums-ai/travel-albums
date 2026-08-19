import { useNegativeStoreSelector } from '@/context/negativeStore';
import NegativeConverterItem from '@/drawers/adjustments/NegativeConverterItem';

export default function NegativeConverterToolboxItem({
  item,
}: {
  item: {
    title: string;

    list: {
      title: string;
      checked: boolean;
      onChange: (checked: boolean) => void;
      sliders: any
    }[];
  };
}) {
  const showGenetic = useNegativeStoreSelector((state) => state.showGenetic)

  if (showGenetic) {
    return <>
      {item.list
        .filter(subItem => subItem.checked)
        .map((subItem) => <NegativeConverterItem
          key={subItem.title}
          title={subItem.title}
          checked={subItem.checked}
          onChange={subItem.onChange}
          sliders={subItem.sliders}
        />)}
    </>;
  }

  return (
    <>
      {/* <Accordion>
        <AccordionSummary>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', px: 1 }}>{item.title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1, py: 0, pb: 1}}> */}
      {item.list?.map((subItem) => <NegativeConverterItem
        key={subItem.title}
        title={subItem.title}
        checked={subItem.checked}
        onChange={subItem.onChange}
        sliders={subItem.sliders}
      />)}
      {/* </AccordionDetails>
      </Accordion> */}
    </>
  );
}
