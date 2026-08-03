import { useState } from 'react';

import GenericPanel from '@/components/generics/GenericPanel';

type FolderEntry = {
  name: string;
  path: string;
};

const CHUNK_SIZE = 5000;

export default function FolderHandlersDrawer() {
  const [folders, setFolders] = useState<Map<string, number>>(new Map());
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);


  return (
    <GenericPanel id="folder-handlers-drawer">
      fff
    </GenericPanel>
  );
}
