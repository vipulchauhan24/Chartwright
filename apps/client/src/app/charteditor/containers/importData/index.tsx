import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CWOutlineButton,
  CWSelect,
  CWSolidButton,
  CWSpinner,
  CWStepper,
  ICWStepper,
} from '@chartwright/core-components';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

import Papa from 'papaparse';
import { read, utils } from 'xlsx';
import useChartConfig from '../../hooks/useChartConfig';

interface IImportData {
  toggleImportDataModal: (open: boolean) => void;
}

function ImportData({ toggleImportDataModal }: IImportData) {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const dropzoneInstRef = useRef<Dropzone>(null);
  const stepperRef = useRef<ICWStepper>(null);

  const [uploadedFileData, setUploadedFileData] = useState<Array<never>>([]);
  const [isFileProcessing, setIsFileProcessing] = useState<boolean>(false);
  const [fileProcessingFinished, setFileProcessingFinished] =
    useState<boolean>(false);
  const [columnNames, setColumnNames] = useState<
    Array<{ id: string; value: string; label: string }>
  >([]);
  const [xColumnName, setXColumnName] = useState<string>();
  const { buildChartConfig } = useChartConfig();

  const processUploadedFile = useCallback((file: Dropzone.DropzoneFile) => {
    try {
      setIsFileProcessing(true);
      const reader = new FileReader();
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          complete: (result) => {
            console.log('CSV Data:', result.data);
          },
        });
      } else if (file.name.endsWith('.xlsx')) {
        reader.onload = (e) => {
          const data = e.target?.result;
          if (!data) return;

          const workbook = read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet);

          setUploadedFileData(jsonData as []);

          // Get headers - first row values
          const headers = utils.sheet_to_json(worksheet, {
            header: 1,
          })[0];

          const columns = (headers as Array<never>).map((name) => {
            return {
              id: name,
              value: name,
              label: name,
            };
          });

          setColumnNames(columns);

          dropzoneInstRef.current?.emit('uploadprogress', file, 100, file.size);
          dropzoneInstRef.current?.emit('success', file, {
            message: 'Processed locally',
          });
          dropzoneInstRef.current?.emit('complete', file);

          setIsFileProcessing(false);
          setFileProcessingFinished(true);

          stepperRef.current?.goNext();
        };
        reader.onerror = () => {
          //   self.emit('error', file, 'Failed to read file');
          //   self.emit('complete', file);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error: unknown) {
      console.error("Error in 'processUploadedFile': ", error);
      //   self.emit('error', file, error?.message || 'Parse failed');
      //   self.emit('complete', file);
    }
  }, []);

  useEffect(() => {
    if (dropzoneRef.current && !dropzoneInstRef.current) {
      Dropzone.autoDiscover = false;

      dropzoneInstRef.current = new Dropzone(dropzoneRef.current, {
        url: '#',
        autoProcessQueue: false,
        uploadMultiple: false,
        maxFiles: 1,
        acceptedFiles: '.csv,.xlsx',
        dictDefaultMessage: 'Drop a CSV/XLSX or click to browse',
        previewsContainer: false,
      });

      dropzoneInstRef.current.on('addedfile', processUploadedFile);
    }

    return () => {
      dropzoneInstRef.current?.destroy();
    };
  }, [processUploadedFile]);

  const resetDropZone = useCallback(() => {
    setFileProcessingFinished(false);
    dropzoneInstRef.current?.removeAllFiles();
  }, []);

  const defaultSelectedColumn = useMemo(() => {
    if (!uploadedFileData.length || !columnNames.length) return undefined;

    for (const col of columnNames) {
      const key = col.value;
      const obj: never = uploadedFileData[0];
      if (typeof obj[key] === 'string') {
        setXColumnName(key);
        return key;
      }
    }
    setXColumnName(columnNames[0].value);
    return columnNames[0].value;
  }, [columnNames, uploadedFileData]);

  const generateChartConfig = useCallback(async () => {
    await buildChartConfig(uploadedFileData, `${xColumnName}`, 'line');
    toggleImportDataModal(false);
  }, [buildChartConfig, toggleImportDataModal, uploadedFileData, xColumnName]);

  const steps = useMemo(() => {
    return [
      {
        id: 'upload',
        label: 'Upload',
        description: 'Add your file.',
        render: () => (
          <div className="relative">
            {isFileProcessing && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 rounded-xl">
                <CWSpinner />
              </div>
            )}

            {fileProcessingFinished && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 rounded-xl">
                <CWSolidButton label="Re-upload" onClick={resetDropZone} />
              </div>
            )}

            <div
              ref={dropzoneRef}
              className="dropzone !border-dashed !rounded-xl !border-border"
            ></div>
          </div>
        ),
      },
      {
        id: 'map',
        label: 'Map Columns',
        description: 'Select x axis data.',
        render: () => (
          <div className="flex flex-col items-center justify-center">
            <CWSelect
              placeholder="Select x axis"
              defaultValue={xColumnName || defaultSelectedColumn}
              items={columnNames}
              onChange={(value: string) => {
                setXColumnName(value);
              }}
            />
            <div className="flex gap-4 mt-2">
              <CWOutlineButton
                label="Cancel"
                onClick={() => {
                  toggleImportDataModal(false);
                }}
              />
              <CWSolidButton label="Confirm" onClick={generateChartConfig} />
            </div>
          </div>
        ),
      },
    ];
  }, [
    isFileProcessing,
    fileProcessingFinished,
    resetDropZone,
    xColumnName,
    defaultSelectedColumn,
    columnNames,
    generateChartConfig,
    toggleImportDataModal,
  ]);

  return (
    <CWStepper steps={steps} onFinish={() => alert('Done!')} ref={stepperRef} />
  );
}

export default React.memo(ImportData);
