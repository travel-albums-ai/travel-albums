import GenericPortal from '@/components/generics/GenericPortal';
import SolidChip from '@/components/SolidChip';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { ReactNode } from 'react';

type BreadscrumbsPrimaryProps = {
  list?: { breadcrumbIcon?: ReactNode, breadcrumbTitle: string }[],
  count?: number,
}

const BREADCRUMBS_PRIMARY_ID = 'breadcrumbs-primary'

export default function BreadscrumbsPrimaryList({ list, count }: BreadscrumbsPrimaryProps) {
  return <GenericPortal targetId={BREADCRUMBS_PRIMARY_ID}>
    <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {list?.map((item) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {item.breadcrumbIcon ? <>{item.breadcrumbIcon}</> : null}
        <Typography variant='body2' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250 }}>
          {item.breadcrumbTitle}
        </Typography>
      </Box>)}
      {typeof count === 'number' && <SolidChip label={`${count}`} height={24} minWidth={60} />}
    </Breadcrumbs>
  </GenericPortal>
}
