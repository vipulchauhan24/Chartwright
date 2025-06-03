import CWLink from '../components/link';
import CWLinkButton from '../components/linkButton';

export default function PageNotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-background text-text-main">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-5xl font-semibold">Page not found</h1>
        <p className="mt-6 text-lg font-medium">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
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
