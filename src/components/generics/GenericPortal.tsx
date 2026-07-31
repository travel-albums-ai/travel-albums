import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  targetId: string;
  children: ReactNode;
};

export default function GenericPortal({ targetId, children }: PortalProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById(targetId));
  }, [targetId]);

  if (!target) {
    return null;
  }

  return createPortal(children, target);
}
