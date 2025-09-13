import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { copyToMemory, fetchFromLocalStorage } from '../../utils/lib';
import toast from 'react-hot-toast';
import { chartId } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import axios from 'axios';
import {
  CWGhostLink,
  CWIconButton,
  CWTabs,
} from '@chartwright/core-components';

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
  const auth = useAuth();
  const [chrtId] = useAtom(chartId);
  const [imageURL, setImageURL] = useState<string>('');
  const [imageURLLoading, setImageURLLoading] = useState<boolean>(true);
  const [iframeURL, setIframeURL] = useState<string>('');
  const [iframeURLLoading, setIframeURLLoading] = useState<boolean>(true);

  const fetchEmbedURL = useCallback(
    async (chrtId: string, type: 'image' | 'iframe') => {
      try {
        const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
        if (!userId) {
          // throw new Error('User not logged in.');
          return;
        }
        const response = await axios.get(
          `/api/embed?chart_id=${chrtId}&user_id=${userId}&type=${type}`
        );
        if (type === 'image' && response.data.length) {
          setImageURL(`${window.location.host}${response.data}`);
        } else if (type === 'image' && !response.data.length) {
          setImageURL('');
        }

        if (type === 'iframe' && response.data.length) {
          setIframeURL(`${window.location.host}${response.data}`);
        } else if (type === 'iframe' && !response.data.length) {
          setIframeURL('');
        }
      } catch (err) {
        console.error('Failed to embed image:', err);
      } finally {
        setImageURLLoading(false);
        setIframeURLLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (chrtId) {
      fetchEmbedURL(chrtId, 'image');
      fetchEmbedURL(chrtId, 'iframe');
    }
  }, [chrtId, fetchEmbedURL]);

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

  const embedToLink = useCallback(
    (type: 'image' | 'iframe') => {
      toast.promise(
        async () => {
          try {
            const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
            if (!userId) {
              throw new Error('User not logged in.');
            }
            await axios.post('/api/embed', {
              type: type,
              chart_id: chrtId,
              user_id: userId,
              created_date: new Date().toISOString(),
            });
            fetchEmbedURL(chrtId, type);
          } catch (err) {
            console.error('Failed to embed image:', err);
            throw err;
          }
        },
        {
          loading: 'Generating...',
          success: <b>Link Generated!</b>,
          error: <b>{EXPORT_ERROR_MSG}</b>,
        }
      );
    },
    [chrtId, fetchEmbedURL]
  );

  const embedItems: Array<IExportItem> = useMemo(() => {
    return [
      {
        label: 'Generate Image Link',
        icon: <CloudCog className="size-6" aria-hidden={true} />,
        image: <img src="/url.png" alt="Generate Link" className="h-6" />,
        onClick: () => {
          embedToLink('image');
        },
        userLoginCheck: true,
        url: imageURL,
        loading: imageURLLoading,
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
          embedToLink('iframe');
        },
        userLoginCheck: true,
        url: iframeURL,
        loading: iframeURLLoading,
      },
    ];
  }, [imageURL, imageURLLoading, iframeURL, iframeURLLoading, embedToLink]);

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
          setImageURL('');
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
        <div className="bg-app py-6 px-4 rounded-md mb-4 border border-default relative">
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
              <div className="h-4 w-2/3 animate-pulse bg-text-secondary rounded-xl mt-4"></div>
              <div className="h-3 w-1/3 animate-pulse bg-text-secondary rounded-xl mt-1"></div>
            </>
          )}
          {!!props.url?.length && !props.loading && (
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1">
                <strong>Link: </strong>
                <CWGhostLink
                  href={props.url}
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
