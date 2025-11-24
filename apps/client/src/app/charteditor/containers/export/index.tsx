import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import {
  Asterisk,
  ChevronsLeftRightEllipsis,
  CloudCog,
  Copy,
  Download,
  LogIn,
  Trash,
} from 'lucide-react';
import useAuthentication from '../../hooks/useAuthentication';
import { useAuth } from 'react-oidc-context';
import {
  base64ToFile,
  copyToMemory,
  EMBEDDABLES,
  fetchFromLocalStorage,
} from '../../utils/lib';
import toast from 'react-hot-toast';
import { allEmbedChartDetails } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../../utils/constants';
import axios from 'axios';
import { CWGhostLink, CWIconButton, CWTabs } from '@chartwright/ui-components';
import { useParams } from 'react-router-dom';

interface IExportItem {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  image: React.ReactNode;
  userLoginCheck?: boolean;
  url?: string;
  loading?: boolean;
}

const EXPORT_ERROR_MSG = 'Oops, try again later.';

function ExportChart() {
  const { isAuthenticated } = useAuthentication();
  const { chart_id } = useParams();
  const auth = useAuth();
  const [allEmbedChartData, setAllEmbedChartData] =
    useAtom(allEmbedChartDetails);
  const [imageURL, setImageURL] = useState<string>('');
  const [iframeURL, setIframeURL] = useState<string>('');
  const [isLoadingEmbedUrls, setIsLoadingEmbedUrls] = useState<boolean>(false);
  const toastrIdRef = useRef('');

  useEffect(() => {
    if (chart_id && allEmbedChartData[chart_id]) {
      setImageURL(allEmbedChartData[chart_id][EMBEDDABLES.STATIC_IMAGE]);
      setIframeURL(allEmbedChartData[chart_id][EMBEDDABLES.DYNAMIC_IFRAME]);
      setIsLoadingEmbedUrls(false);
    }
  }, [allEmbedChartData, chart_id]);

  useEffect(() => {
    if (chart_id) {
      setIsLoadingEmbedUrls(true);
    }
  }, [chart_id]);

  const uploadEmbeddableStaticImage = useCallback(
    async (event: any) => {
      try {
        const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
        if (!userId) {
          throw new Error('User not logged in.');
        } else if (!chart_id) {
          throw new Error(
            'Chart not saved. Please save chart once or load any saved chart.'
          );
        }

        const formData = new FormData();
        formData.append('file', base64ToFile(event.uri));
        formData.append('type', EMBEDDABLES.STATIC_IMAGE);
        formData.append('chartId', chart_id);
        formData.append('createdBy', userId);
        formData.append('createdDate', new Date().toISOString());

        const response = await axios.put(
          `${API_ENDPOINTS.USER_CHARTS_EMBED}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setAllEmbedChartData((prev: any) => {
          return {
            ...prev,
            [`${chart_id}`]: {
              ...prev[chart_id],
              'static-image': response['data']['static-image'],
            },
          };
        });
        toast.success(<b>Link Generated!</b>, {
          id: toastrIdRef.current,
        });
      } catch (error: any) {
        console.error(error);
        if (error === 'User not logged in.') {
          toast.error(<b>User not logged in!</b>, {
            id: toastrIdRef.current,
          });
          return;
        } else if (error.status === 409) {
          toast.error(<b>Link already generated!</b>, {
            id: toastrIdRef.current,
          });
          return;
        }
        toast.error(<b>{EXPORT_ERROR_MSG}</b>, {
          id: toastrIdRef.current,
        });
      }
    },
    [chart_id, setAllEmbedChartData]
  );

  useEffect(() => {
    if (!chart_id) {
      return;
    }
    emitter.on(EVENTS.UPLOAD_EMBED_STATIC_IMAGE, uploadEmbeddableStaticImage);

    return () => {
      emitter.off(
        EVENTS.UPLOAD_EMBED_STATIC_IMAGE,
        uploadEmbeddableStaticImage
      );
    };
  }, [uploadEmbeddableStaticImage, chart_id]);

  const downloadItems: Array<IExportItem> = useMemo(() => {
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
        label: 'Download PNG',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/png.png" alt="Export To" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_PNG);
        },
      },
      // {
      //   label: 'Download SVG',
      //   icon: <Download className="size-6" aria-hidden={true} />,
      //   image: <img src="/svg.png" alt="Export To SVG" className="h-6" />,
      //   onClick: () => {
      //     emitter.emit(EVENTS.EXPORT_TO_SVG);
      //   },
      // },
      {
        label: 'Download JPG',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/jpg.png" alt="Export To JPG" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_JPG);
        },
      },
      {
        label: 'Download PDF',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/pdf.png" alt="Export To PDF" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_PDF);
        },
      },
    ];
  }, []);

  const generateEmbedableCharts = useCallback(
    (type: EMBEDDABLES) => {
      if (type === EMBEDDABLES.STATIC_IMAGE) {
        const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
        if (!userId) {
          toast.error(<b>User not logged in.</b>);
          return;
        } else if (!chart_id) {
          toast.error(
            <b>
              Chart not saved. Please save chart once or load any saved chart.
            </b>
          );
          return;
        }
        toastrIdRef.current = toast.loading('Generating embedable link...');
        emitter.emit(EVENTS.EMBED_STATIC_IMAGE);

        return;
      }
    },
    [chart_id]
  );

  const embedItems: Array<IExportItem> = useMemo(() => {
    return [
      {
        label: 'Generate Static Embedable Image',
        icon: <CloudCog className="size-6" aria-hidden={true} />,
        image: <img src="/url.png" alt="Generate Link" className="h-6" />,
        onClick: () => {
          generateEmbedableCharts(EMBEDDABLES.STATIC_IMAGE);
        },
        userLoginCheck: true,
        url: imageURL,
        loading: isLoadingEmbedUrls,
      },
      {
        label: 'Generate Interactive Frame',
        icon: <CloudCog className="size-6" aria-hidden={true} />,
        image: (
          <img
            src="/interaction.png"
            alt="Generate Interactive Frame"
            className="h-6"
          />
        ),
        onClick: () => {
          generateEmbedableCharts(EMBEDDABLES.DYNAMIC_IFRAME);
        },
        userLoginCheck: true,
        url: iframeURL,
        loading: isLoadingEmbedUrls,
      },
    ];
  }, [imageURL, isLoadingEmbedUrls, iframeURL, generateEmbedableCharts]);

  const redirectToLoginPage = useCallback(() => {
    auth.signinRedirect();
  }, [auth]);

  const LoginRequiredComp = useCallback(() => {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-between px-4 z-10 opacity-0 hover:opacity-100">
        <div className="flex items-center gap-1">
          <Asterisk className="size-4 text-surface mb-3" aria-hidden={true} />
          <p className="font-semibold text-surface">Login Required</p>
        </div>
        <CWIconButton
          icon={<LogIn className="size-6" aria-hidden={true} />}
          onClick={redirectToLoginPage}
        />
      </div>
    );
  }, [redirectToLoginPage]);

  const copyToClipboard = useCallback(async (url: string) => {
    toast.promise(
      async () => {
        try {
          const blob = new Blob([url], { type: 'text/plain' });
          await copyToMemory({ 'text/plain': blob });
        } catch (err) {
          console.error('Failed to copy link:', err);
          throw err;
        }
      },
      {
        loading: 'Copying...',
        success: <b>Link Copied!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  const deleteEmbedURL = useCallback(async (url: string) => {
    toast.promise(
      async () => {
        try {
          const id = url.split('/')[url.split('/').length - 1];
          await axios.delete(`/api/embed/${id}`);
        } catch (err) {
          console.error('Failed to delete embed link:', err);
          throw err;
        }
      },
      {
        loading: 'Deleting Link...',
        success: <b>Deleted Successfully!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  const Card = useCallback(
    (props: IExportItem) => {
      return (
        <div className="bg-app py-3 px-4 rounded-md mb-4 border border-default relative">
          {!isAuthenticated && props.userLoginCheck && <LoginRequiredComp />}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {props.image}
              <p className="font-semibold">{props.label}</p>
            </div>
            <CWIconButton
              icon={props.icon}
              onClick={props.onClick}
              disabled={!!props.url}
              aria-label={props.label}
            />
          </div>
          {props.loading && (
            <>
              <div className="h-4 w-2/3 animate-pulse bg-black/20 rounded-xl mt-4"></div>
              <div className="h-3 w-1/3 animate-pulse bg-black/20 rounded-xl mt-1"></div>
            </>
          )}
          {!!props.url?.length && !props.loading && (
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1">
                <strong>Link: </strong>
                <CWGhostLink
                  href={props.url}
                  newTab={true}
                  label={<span className="truncate w-56">{props.url}</span>}
                />
              </span>
              <CWIconButton
                tooltip="Copy link"
                icon={<Copy className="size-4" aria-hidden={true} />}
                onClick={() => {
                  copyToClipboard(`${props.url}`);
                }}
              />
              <CWIconButton
                tooltip="Delete link"
                icon={<Trash className="size-4" aria-hidden={true} />}
                onClick={async () => {
                  deleteEmbedURL(`${props.url}`);
                }}
              />
            </div>
          )}
        </div>
      );
    },
    [LoginRequiredComp, copyToClipboard, deleteEmbedURL, isAuthenticated]
  );

  const tabList = useMemo(() => {
    return [
      {
        id: 'download-chart',
        title: 'Download',
        icon: (
          <Download
            className="size-4"
            aria-hidden={true}
            aria-label="Download"
          />
        ),
        content: (
          <>
            {downloadItems.map((item: IExportItem) => (
              <Card key={item.label} {...item} />
            ))}
          </>
        ),
      },
      {
        id: 'embed-chart',
        title: 'Embed',
        icon: (
          <ChevronsLeftRightEllipsis
            className="size-4"
            aria-hidden={true}
            aria-label="Embed"
          />
        ),
        content: (
          <>
            {embedItems.map((item: IExportItem) => (
              <Card key={item.label} {...item} />
            ))}
          </>
        ),
      },
    ];
  }, [Card, downloadItems, embedItems]);

  return (
    <div className="mt-4">
      <CWTabs defaultSelected={tabList[0]['id']} tabList={tabList} />
    </div>
  );
}

export default ExportChart;
