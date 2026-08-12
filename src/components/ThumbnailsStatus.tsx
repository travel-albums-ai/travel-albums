import IndexerMetrics from '@/components/IndexerMetrics';
import PopoverButton from '@/components/PopoverButton';
import SolidChip from '@/components/SolidChip';
import { parseIndexerLine } from '@/indexer/IndexerUtils';
import { Box, LinearProgress, ToggleButton, Tooltip, Typography } from '@mui/material';
import { DatabaseSearch, Info, Play, StopCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ThumbnailsStatus({ lastLine, busy, handleGenerate, handleDelete }: { lastLine?: string | null, busy: boolean, handleGenerate: () => void, handleDelete: () => void }) {
  const { t } = useTranslation()
  const indexerLine = parseIndexerLine(lastLine ?? '');
  const percentDone = indexerLine.processed && indexerLine.total
    ? Math.round((Number(indexerLine.processed) + Number(indexerLine.generated)) / Number(indexerLine.total) * 100)
    : 0;
  const timeReminingMinutes = indexerLine?.ETA ? Math.round(Number(indexerLine.ETA) / 1000 / 60) : null;

  return (<>
    <PopoverButton id="indexer" upsideDown={true} width={650} label="" icon="" trigger={<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <DatabaseSearch size={16} />

      {(Number(indexerLine?.total) - Number(indexerLine?.processed))  > 0
        ? <>
          <LinearProgress color="inherit" sx={{ width: 70 }} variant="determinate" value={Number(indexerLine?.processed) + Number(indexerLine?.generated)} max={Number(indexerLine?.total)} />
          <SolidChip count={percentDone} label="%" height={20} minWidth={40} fontSize={10} />
          <SolidChip count={Number(timeReminingMinutes)} label={t('indexerEta')} height={20} minWidth={70} fontSize={10} />
        </>
        : <Typography variant="caption" color="inherit" sx={{ lineHeight: 1 }}>
          {t('indexerLabel')}
        </Typography>}
    </Box>}
    anchorVertical="top"
    anchorHorizontal="center"
    transformVertical="bottom"
    transformHorizontal="center"
    >
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          {!busy && <ToggleButton
            sx={{ textTransform: 'none' }}
            value="auto"
            size="small"
            onChange={handleGenerate}
            // disabled={busy}
          >
            <Play size={16} style={{ marginRight: 8 }} />
            {t('indexerStart')}
          </ToggleButton>}

          {busy && <ToggleButton
            sx={{ textTransform: 'none' }}
            value="auto"
            size="small"
            onChange={handleDelete}
            // disabled={!busy}
          >
            <StopCircle size={16} style={{ marginRight: 8 }} />
            {t('indexerStop')}
          </ToggleButton>}
          {busy && <SolidChip count={percentDone} label="%" height={40} minWidth={50} fontSize={12} />}
          {busy && timeReminingMinutes !== null && <SolidChip count={Number(timeReminingMinutes)} label="min left" height={40} minWidth={90} fontSize={12} />}
          {busy && <LinearProgress
            color="inherit" sx={{ flex: 1, borderRadius: 2, height: 16 }}
            variant="determinate"
            value={Number(indexerLine?.processed) + Number(indexerLine?.generated)} max={Number(indexerLine?.total)} />}

          <Tooltip title={t('indexerTooltip')} placement="top">
            <Info size={16} />
          </Tooltip>
        </Box>

        <Box sx={ { minHeight: 250, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 } }>
          {lastLine && (
            <IndexerMetrics line={lastLine} />
          )}
          {!lastLine && (
            <Typography variant="body2" color="textDisabled" sx={{ p: 10, opacity: 0.8, textAlign: 'center' }}>
              {t('indexerClickStartPrompt')}
            </Typography>
          )}
        </Box>
      </Box>
    </PopoverButton>
  </>);
}
