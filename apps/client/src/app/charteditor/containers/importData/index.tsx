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
  CWSolidLoadingButton,
  CWSpinner,
  CWStepper,
  ICWStepper,
} from '@chartwright/ui-components';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

import Papa from 'papaparse';
import { read, utils } from 'xlsx';
import useChartConfig from '../../hooks/useChartConfig';
import { capitalizeFirstLetter, CHART_TYPES } from '../../utils/lib';
import { chartTitle } from '../../../../store/charts';
import { useAtom } from 'jotai';

interface IImportData {
  toggleImportDataModal: (open: boolean) => void;
}

function ImportData({ toggleImportDataModal }: IImportData) {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const dropzoneInstRef = useRef<Dropzone>(null);
  const stepperRef = useRef<ICWStepper>(null);
  const chartTypes = useRef<
    Array<{
      id: string;
      value: string;
      label: string;
    }>
  >([
    {
      id: 'chart-types-bar',
      value: CHART_TYPES.BAR,
      label: capitalizeFirstLetter(CHART_TYPES.BAR),
    },
    {
      id: 'chart-types-column',
      value: CHART_TYPES.COLUMN,
      label: capitalizeFirstLetter(CHART_TYPES.COLUMN),
    },
    {
      id: 'chart-types-line',
      value: CHART_TYPES.LINE,
      label: capitalizeFirstLetter(CHART_TYPES.LINE),
    },
    {
      id: 'chart-types-area',
      value: CHART_TYPES.AREA,
      label: capitalizeFirstLetter(CHART_TYPES.AREA),
    },
  ]);

  const [uploadedFileData, setUploadedFileData] = useState<Array<never>>([]);
  const [isFileProcessing, setIsFileProcessing] = useState<boolean>(false);
  const [fileProcessingFinished, setFileProcessingFinished] =
    useState<boolean>(false);
  const [columnNames, setColumnNames] = useState<
    Array<{ id: string; value: string; label: string }>
  >([]);
  const [xColumnName, setXColumnName] = useState<string>();
  const [chartType, setChartType] = useState<CHART_TYPES>(CHART_TYPES.BAR);
  const { isProcessing, buildChartConfig } = useChartConfig();
  const [, setChrtTitle] = useAtom(chartTitle);

  const processHeaders = useCallback(
    (headers: Array<string>, file: { size: number }) => {
      const columns = headers.map((name) => {
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
    },
    []
  );

  const processXlsxFile = useCallback(
    (e: ProgressEvent<FileReader>, file: { size: number }) => {
      try {
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
        processHeaders(headers as Array<string>, file);
      } catch (error: unknown) {
        console.error('Error in reading excel file: ', error);
        dropzoneInstRef.current?.emit(
          'error',
          file,
          'Failed to read the uploaded file.'
        );
        setIsFileProcessing(false);
      }
    },
    [processHeaders]
  );

  const processCsvData = useCallback(
    (result: Papa.ParseResult<unknown>, file: { size: number }) => {
      setUploadedFileData(result.data as []);
      const headers: string[] = result.meta.fields || [];
      processHeaders(headers, file);
    },
    [processHeaders]
  );

  const processUploadedFile = useCallback(
    (file: Dropzone.DropzoneFile) => {
      try {
        setIsFileProcessing(true);
        if (file.name.endsWith('.csv')) {
          Papa.parse(file, {
            header: true,
            dynamicTyping: true, //Prevent numbers to be converted to string.
            complete: (result) => {
              processCsvData(result, file);
            },
            error: () => {
              dropzoneInstRef.current?.emit(
                'error',
                file,
                'Failed to read the uploaded file.'
              );
              setIsFileProcessing(false);
            },
          });
        } else if (file.name.endsWith('.xlsx')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            processXlsxFile(e, file);
          };
          reader.readAsArrayBuffer(file);
          reader.onerror = () => {
            dropzoneInstRef.current?.emit(
              'error',
              file,
              'Failed to read the uploaded file.'
            );
            setIsFileProcessing(false);
          };
        }
      } catch (error: unknown) {
        console.error('Error in processing uploaded file: ', error);
        setIsFileProcessing(false);
      }
    },
    [processCsvData, processXlsxFile]
  );

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
    const chartConfig = await buildChartConfig(
      uploadedFileData,
      `${xColumnName}`,
      chartType
    );
    setChrtTitle(chartConfig.title.text || 'Chart');
    toggleImportDataModal(false);
  }, [
    buildChartConfig,
    chartType,
    toggleImportDataModal,
    uploadedFileData,
    xColumnName,
    setChrtTitle,
  ]);

  const steps = useMemo(() => {
    return [
      {
        id: 'import-data-upload',
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
              className="dropzone !border-dashed !rounded-xl !border-default"
            ></div>
          </div>
        ),
      },
      {
        id: 'import-data-map',
        label: 'Chart data',
        description: 'Select chart axis and type.',
        render: () => (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span>X-Axis: </span>
                <CWSelect
                  id="import-data-select-x-axis"
                  placeholder="Select x axis"
                  defaultValue={xColumnName || defaultSelectedColumn}
                  items={columnNames}
                  onChange={(value: string) => {
                    setXColumnName(value);
                  }}
                  disabled={isProcessing}
                />
              </div>

              <div className="flex items-center gap-2">
                <span>Chart type: </span>
                <CWSelect
                  id="import-data-select-chart-type"
                  placeholder="Select chart type"
                  defaultValue={chartType}
                  items={chartTypes.current}
                  onChange={(value: string) => {
                    setChartType(value as CHART_TYPES);
                  }}
                  disabled={isProcessing}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <CWOutlineButton
                label="Cancel"
                onClick={() => {
                  toggleImportDataModal(false);
                }}
                disabled={isProcessing}
              />
              <CWSolidLoadingButton
                label="Generate"
                onClick={generateChartConfig}
                loadingLabel="Processing"
                loading={isProcessing}
                disabled={isProcessing}
              />
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
    isProcessing,
    chartType,
    generateChartConfig,
    toggleImportDataModal,
  ]);

  return (
    <CWStepper steps={steps} onFinish={() => alert('Done!')} ref={stepperRef} />
  );
}

export default React.memo(ImportData);
