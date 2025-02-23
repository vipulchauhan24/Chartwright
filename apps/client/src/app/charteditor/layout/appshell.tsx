import AppHeader from './appheader';

function AppShell({ children }: { children: React.ReactElement }) {
  return (
    <div className="w-full h-full">
      <AppHeader />
      <main className="h-[calc(100%_-_4.5rem)]">{children}</main>
    </div>
  );
}

export default AppShell;
