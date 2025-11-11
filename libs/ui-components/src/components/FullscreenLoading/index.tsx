import { CWSpinner } from '../Spinner';

export function CWFullscreenLoading() {
  return (
    <div className="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-black/20 z-50">
      <CWSpinner />
    </div>
  );
}
