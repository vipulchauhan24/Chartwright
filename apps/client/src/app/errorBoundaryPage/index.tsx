import { CWSolidButton } from '@chartwright/core-components';
import CWLink from '../components/link';

function ErrorBoundaryPage() {
  return (
    <main className="grid min-h-full place-items-center bg-background text-text-main">
      <div className="text-center">
        <p className="text-base font-semibold">500</p>
        <h1 className="mt-4 text-5xl font-semibold">
          Woops! Something went wrong.
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <CWSolidButton
            onClick={() => {
              window.location.reload();
            }}
            label="Refresh"
          />
          <CWLink
            href="/"
            label={
              <p>
                Contact support <span aria-hidden="true">&rarr;</span>
              </p>
            }
          ></CWLink>
        </div>
      </div>
    </main>
  );
}

export default ErrorBoundaryPage;
