import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import CWButton from '../../../components/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import CWModal from '../../../components/modal';
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
import CWLink from '../../../components/link';
import IconButton from '../../../components/iconButton';
import { copyToMemory, fetchFromLocalStorage } from '../../utils/lib';
import toast from 'react-hot-toast';
import { chartId } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import axios from 'axios';

interface IExportChart {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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

function ExportChart(props: IExportChart) {
  const { isOpen, setIsOpen } = props;
  const { isAuthenticated } = useAuthentication();
  const auth = useAuth();
  const [chrtId] = useAtom(chartId);
  const [imageURL, setImageURL] = useState<string>('');
  const [imageURLLoading, setImageURLLoading] = useState<boolean>(true);
  const [iframeURL, setIframeURL] = useState<string>('');
  const [iframeURLLoading, setIframeURLLoading] = useState<boolean>(true);

  const closeModal = () => {
    setIsOpen(false);
  };

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
          emitter.emit(EVENTS.EXPORT_TO_IMAGE);
        },
      },
      {
        label: 'Download SVG',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/svg.png" alt="Export To SVG" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_SVG);
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
    [chrtId]
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
        items: embedItems,
      },
    ];
  }, [downloadItems, embedItems]);

  const redirectToLoginPage = () => {
    auth.signinRedirect();
  };

  const LoginRequiredComp = () => {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-between px-4 z-10 opacity-0 hover:opacity-100">
        <div className="flex items-center gap-1">
          <Asterisk className="size-4 text-white mb-3" aria-hidden={true} />
          <p className="font-semibold text-white">Login Required</p>
        </div>
        <CWButton
          tertiary
          additionalCssClasses={
            'text-white hover:text-white hover:scale-125 transition-all'
          }
          label={<LogIn className="size-6" aria-hidden={true} />}
          onClick={redirectToLoginPage}
        />
      </div>
    );
  };

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

  const Card = (props: IExportItem) => {
    return (
      <div className="bg-background py-6 px-4 rounded-md mb-4 border border-border relative">
        {!isAuthenticated && props.userLoginCheck && <LoginRequiredComp />}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {props.image}
            <p className="font-semibold">{props.label}</p>
          </div>
          <CWButton
            label={props.icon}
            tertiary
            onClick={props.onClick}
            disabled={!!props.url}
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
              <CWLink
                href={props.url}
                label={<span className="truncate w-56">{props.url}</span>}
              />
            </span>
            <IconButton
              tooltip="Copy link"
              icon={<Copy className="size-4" aria-hidden={true} />}
              onClick={() => {
                copyToClipboard(`${props.url}`);
              }}
            />
            <IconButton
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
  };

  const getTabPanel = (title: string, items: Array<IExportItem>) => {
    return (
      <TabPanel key={title + '-tab-panel'} className="py-4">
        {items.map((item: IExportItem) => (
          <Card key={item.label} {...item} />
        ))}
      </TabPanel>
    );
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
