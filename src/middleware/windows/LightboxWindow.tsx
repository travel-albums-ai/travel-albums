import LightboxWindowInner from './lightbox/LightboxWindow';

// Proxy HOC for backward/structural compatibility.
export default function LightboxWindow(props: any) {
  return <LightboxWindowInner {...props} />;
}
