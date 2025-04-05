import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import CWRadioInput from '../../../components/radioInput';
import CWButton from '../../../components/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import { exportImageTypes } from '../../utils/constants';
import CWModal from '../../../components/modal';
import CWTextInput from '../../../components/textInput';

interface IExportChart {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ExportChart(props: IExportChart) {
  const { isOpen, setIsOpen } = props;
  const [imageURI, setImageURI] = useState<string>();
  const [fileName, setFileName] = useState<string>('chart');

  const closeModal = () => {
    setIsOpen(false);
  };

  const updatePreviewImage: any = ({ imgURI }: { imgURI: string }) => {
    setImageURI(imgURI);
  };

  useEffect(() => {
    if (isOpen) {
      emitter.on(EVENTS.PREVIEW_IMAGE, updatePreviewImage);
      onExportAsImageFileTypeUpdate('png');
    }

    return () => {
      emitter.off(EVENTS.PREVIEW_IMAGE, updatePreviewImage);
    };
  }, [isOpen]);

  const onExportAsImageFileTypeUpdate = (value: string) => {
    emitter.emit(EVENTS.ON_IMAGE_FILE_TYPE_UPDATE, { type: value });
  };

  const onExportAsPDFFileTypeUpdate = () => {
    emitter.emit(EVENTS.ON_PDF_FILE_TYPE_UPDATE);
  };

  const saveChart = useCallback(() => {
    try {
      const a = document.createElement('a'); //Create <a>
      a.href = `${imageURI}`; //Image Base64 Goes here
      a.download = fileName; //File name Here
      a.click();
    } catch (error) {
      console.error('Not able to save file at the moment.', error);
    }
  }, [fileName, imageURI]);

  const onFileNameInputUpdate = (event: any) => {
    setFileName(event.target.value);
  };

  const tabList = useMemo(() => {
    return [
      {
        title: 'Image',
        items: exportImageTypes,
        onChange: onExportAsImageFileTypeUpdate,
      },
      {
        title: 'Pdf',
        onChange: onExportAsPDFFileTypeUpdate,
      },
    ];
  }, []);

  const getTabPanel = (
    title: string,
    items: any,
    onChange: (value: string) => void
  ) => {
    switch (title) {
      case 'Image':
        return (
          <TabPanel className="py-4 min-h-[412px] min-w-[376px]">
            <ul>
              <CWRadioInput items={items} onChange={onChange} />
            </ul>
            <div className="mt-2">
              <CWTextInput
                id="export-file-name"
                label="Filename:"
                placeholder="Type file name here..."
                defaultValue={fileName}
                onChange={onFileNameInputUpdate}
              />
              <h4 className="text-base font-normal pb-2 mt-4">
                Image Preview:
              </h4>
              {imageURI && (
                <img
                  src={imageURI}
                  alt="Preview"
                  className="w-auto h-60 border mx-auto border-primary-border rounded-lg p-2"
                />
              )}
            </div>
          </TabPanel>
        );
      case 'Pdf':
        return (
          <TabPanel className="py-4 min-h-[412px] min-w-[376px]">
            <div>
              <CWTextInput
                id="export-file-name"
                label="Filename:"
                placeholder="Type file name here..."
                defaultValue={fileName}
                onChange={onFileNameInputUpdate}
              />
            </div>
          </TabPanel>
        );

      default:
        return null;
    }
  };

  const onTabChange = (index: number) => {
    if (index === 0) {
      onExportAsImageFileTypeUpdate('png');
    } else {
      onExportAsPDFFileTypeUpdate();
    }
  };

  return (
    <CWModal isOpen={isOpen} setIsOpen={setIsOpen} title="Export">
      <div>
        <TabGroup
          className="mt-2"
          onChange={(index) => {
            onTabChange(index);
          }}
        >
          <TabList className="flex gap-1 border-b border-primary-main">
            {tabList.map(({ title }) => (
              <Tab
                key={title}
                className="py-2 px-1 text-sm/6 font-semibold focus:outline-none data-[selected]:border-b-2 data-[hover]:border-primary-main data-[selected]:text-primary-main data-[hover]:text-primary-main"
              >
                {title}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {tabList.map(({ title, items, onChange }) => {
              return getTabPanel(title, items, onChange);
            })}
          </TabPanels>
        </TabGroup>

        <div className="mt-2 flex items-center justify-end gap-2">
          <CWButton label="Cancel" onClick={closeModal} />
          <CWButton label="Save" onClick={saveChart} />
        </div>
      </div>
    </CWModal>
  );
}

export default ExportChart;
