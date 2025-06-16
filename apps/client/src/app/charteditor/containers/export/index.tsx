import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import CWButton from '../../../components/button';
import { useMemo } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import CWModal from '../../../components/modal';
import { ChevronsLeftRightEllipsis, Copy, Download } from 'lucide-react';

interface IExportChart {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ExportChart(props: IExportChart) {
  const { isOpen, setIsOpen } = props;

  const closeModal = () => {
    setIsOpen(false);
  };

  const downloadItems = useMemo(() => {
    return [
      {
        label: 'Copy To Clipboard',
        icon: <Copy className="size-6" aria-hidden={true} />,
        image: (
          <img src="/clipboard.png" alt="Copy To Clipboard" className="h-6" />
        ),
        onClick: () => {
          emitter.emit(EVENTS.COPY_TO_CLIPBAORD);
        },
      },
      {
        label: 'Export To Image',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/png.png" alt="Export To" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_IMAGE);
        },
      },
      {
        label: 'Export To PDF',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/pdf.png" alt="Export To PDF" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_PDF);
        },
      },
    ];
  }, []);

  const tabList = useMemo(() => {
    return [
      {
        title: 'Download',
        icon: <Download className="size-4" aria-hidden={true} />,
        items: downloadItems,
      },
      {
        title: 'Embed',
        icon: (
          <ChevronsLeftRightEllipsis className="size-4" aria-hidden={true} />
        ),
        items: downloadItems,
      },
    ];
  }, [downloadItems]);

  const getTabPanel = (
    title: string,
    items: Array<{
      onClick: () => void;
      label: string;
      icon: React.ReactNode;
      image: React.ReactNode;
    }>
  ) => {
    switch (title) {
      case 'Download':
        return (
          <TabPanel className="py-4">
            <div>
              {items.map(
                (item: {
                  onClick: () => void;
                  label: string;
                  icon: React.ReactNode;
                  image: React.ReactNode;
                }) => {
                  return (
                    <div className="flex items-center justify-between bg-background py-6 px-4 rounded-md mb-4 border border-border">
                      <div className="flex items-center gap-4">
                        {item.image}
                        <p className="font-semibold">{item.label}</p>
                      </div>
                      <CWButton
                        label={item.icon}
                        tertiary
                        onClick={item.onClick}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </TabPanel>
        );
      // case 'Pdf':
      //   return (
      //     <TabPanel className="py-4 min-h-[412px] min-w-[376px]">
      //       <div>
      //         <CWTextInput
      //           id="export-file-name"
      //           label="Filename:"
      //           placeholder="Type file name here..."
      //           defaultValue={fileName}
      //           onChange={onFileNameInputUpdate}
      //         />
      //       </div>
      //     </TabPanel>
      //   );

      default:
        return null;
    }
  };

  return (
    <CWModal isOpen={isOpen} setIsOpen={setIsOpen} title="Export">
      <div className="w-96">
        <TabGroup className="mt-2">
          <TabList className="flex gap-1 bg-background rounded-md px-2 py-1">
            {tabList.map(({ title, icon }) => (
              <Tab
                key={title}
                className="text-sm font-semibold data-[selected]:bg-white data-[selected]:text-primary py-1 px-2 rounded-md flex items-center gap-1"
              >
                {icon}
                {title}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {tabList.map(({ title, items }) => {
              return getTabPanel(title, items);
            })}
          </TabPanels>
        </TabGroup>

        <div className="mt-2 flex items-center justify-end gap-2">
          <CWButton primary label="Done" onClick={closeModal} />
        </div>
      </div>
    </CWModal>
  );
}

export default ExportChart;
