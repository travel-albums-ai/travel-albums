import { routeIcons } from '@/icons/IconsIndex';
import { getRouteDetailsByPath } from '@/routes';
import { Box, Breadcrumbs, Link, Theme, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export default function BreadcrumbsToolbar({ asIs = false }: { asIs?: boolean }) {
  const { pathname } = useLocation()

  const routeDetails = useMemo(
    () => getRouteDetailsByPath(pathname),
    [pathname],
  )

  const breadcrumbTitle = routeDetails?.title ?? 'Page'
  const breadcrumbIcon = routeIcons[routeDetails?.path ?? '']

  return (
    <Box sx={asIs ? {} : wrapperSx}>
      <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Link
          component={RouterLink}
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
          color="inherit"
          variant='body2'
          to="/dashboard"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <img src="/logo_new_48.png" alt="TravelAlbums" style={{ width: 16, height: 16 }} />
            TravelAlbums
          </Box>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {breadcrumbIcon ? <>{breadcrumbIcon}</> : null}
          <Typography variant='body2'>{breadcrumbTitle}</Typography>
        </Box>
        <Box id="breadcrumbs-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 4, flex: 1 }} />
      </Breadcrumbs>
    </Box>
  )
}

const wrapperSx = {
  display: 'flex', alignItems: 'center',
  zIndex: (theme: Theme) => theme.zIndex.appBar,
  boxShadow: 1,
  m: 0.75,
  borderRadius: 2,
  minHeight: '48px',
  bgcolor: 'background.default',
  justifyContent: 'space-between',
  py: 0,
  px: 2,
  pr: 1,
}
