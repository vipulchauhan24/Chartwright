import AppSidebar from './appsidebar';

function AppShell({ children }: { children: React.ReactElement }) {
  return (
    <div className="flex items-start w-full h-full">
      <AppSidebar />
      {children}
    </div>
  );
}

export default AppShell;
