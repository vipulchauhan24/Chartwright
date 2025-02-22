import CWLink from '../../components/link';
import GlobalOptionsEditor from '../containers/globalOptionsEditor';

const AppSidebar = () => {
  return (
    <aside className="w-1/5 min-w-80 h-full border-r border-primary-border flex flex-col items-center overflow-y-auto">
      <div className="flex items-center justify-center px-10 py-4 w-full">
        <CWLink
          href="/"
          nohover
          label={<img src="/cw-logo.png" alt="chart wright" className="h-12" />}
        />
      </div>
      <div className="overflow-y-auto w-full h-full">
        <GlobalOptionsEditor />
      </div>
      <div className="pb-5">
        <CWLink href="#" label="Need Help?" />
      </div>
    </aside>
  );
};

export default AppSidebar;
