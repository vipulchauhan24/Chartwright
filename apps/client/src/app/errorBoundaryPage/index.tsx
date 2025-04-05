import CWLink from '../components/link';
import CWLinkButton from '../components/linkButton';

function ErrorBoundaryPage() {
  return (
    <main className="grid min-h-full place-items-center bg-primary-background text-primary-text">
      <div className="text-center">
        <p className="text-base font-semibold">500</p>
        <h1 className="mt-4 text-5xl font-semibold">
          Woops! Something went wrong.
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <CWLinkButton href="/" label="Go back home" />
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
