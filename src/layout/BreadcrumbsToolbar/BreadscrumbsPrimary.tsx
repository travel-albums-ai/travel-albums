import GenericPortal from '@/components/generics/GenericPortal';
import { ReactNode } from 'react';

const BREADCRUMBS_PRIMARY_ID = 'breadcrumbs-primary'

export default function BreadscrumbsPrimary({ children } : { children: ReactNode }) {
  return <GenericPortal targetId={BREADCRUMBS_PRIMARY_ID}>
    {children}
  </GenericPortal>
}

// TODO: deprecate
