import IndexerMetricCard from '@/components/IndexerMetricCard';
import { parseRichIndexerLine } from '@/indexer/IndexerUtils';
import { Box } from '@mui/material';

export default function IndexerMetrics({ line }: { line: string }) {
  const indexerLine = parseRichIndexerLine(line);

  return (<>
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(4, 1fr)`, gap: 1 }}>
      {Object.entries(indexerLine).map(([key, value]) => <IndexerMetricCard
        key={key}
        line={`${value?.label}: ${value?.value}`}
        object={value}
        format={value?.format}
        showChart={value?.showChart}
      />)}
    </Box>
  </>)
}
