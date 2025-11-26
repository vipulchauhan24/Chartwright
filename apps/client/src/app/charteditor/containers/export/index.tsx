import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import {
  ChevronsLeftRightEllipsis,
  CloudCog,
  Copy,
  Download,
} from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { EMBEDDABLES, fetchFromLocalStorage } from '../../utils/lib';
import toast from 'react-hot-toast';
import { allEmbedChartDetails } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { CWTabs } from '@chartwright/ui-components';
import { useParams } from 'react-router-dom';
import EmbedChartCard, { IEmbedChartCard } from './EmbedChartCard';
import useEmbedCharts from '../../hooks/useEmbedCharts';

function ExportChart() {
  const { chart_id } = useParams();
  const { isAuthenticated, signinRedirect } = useAuth();
  const [allEmbedChartData] = useAtom(allEmbedChartDetails);
  const [embedLinks, setEmbedLinks] = useState({
    image: {
      url: '',
      loading: true,
      disabled: false,
    },
    iframe: {
      url: '',
      loading: true,
      disabled: false,
    },
  });
  const toastrIdRef = useRef('');
  const { savingChanges, uploadEmbeddableStaticImage } = useEmbedCharts();

  useEffect(() => {
    if (chart_id && allEmbedChartData[chart_id]) {
      const imageUrl = allEmbedChartData[chart_id][EMBEDDABLES.STATIC_IMAGE];
      const iFrameUrl = allEmbedChartData[chart_id][EMBEDDABLES.DYNAMIC_IFRAME];

      setEmbedLinks((prev) => {
        return {
          ...prev,
          image: {
            ...prev.image,
            url: imageUrl,
            loading: !imageUrl?.length,
          },
          iframe: {
            ...prev.iframe,
            url: iFrameUrl,
            loading: !iFrameUrl?.length,
          },
        };
      });
    }

    return () => {
      setEmbedLinks((prev) => {
        return {
          ...prev,
          image: {
            url: '',
            loading: false,
            disabled: false,
          },
          iframe: {
            url: '',
            loading: false,
            disabled: false,
          },
        };
      });
    };
  }, [allEmbedChartData, chart_id]);

  useEffect(() => {
    setEmbedLinks((prev) => {
      return {
        ...prev,
        image: {
          ...prev.image,
          disabled: savingChanges.staticImage,
        },
        iframe: {
          ...prev.iframe,
          disabled: savingChanges.iframe,
        },
      };
    });
  }, [savingChanges]);

  const uploadStaticImage = useCallback(
    (event: any) => {
      uploadEmbeddableStaticImage(event, chart_id as string, {
        id: toastrIdRef.current,
        success: <b>Link Generated!</b>,
        apiError: <b>Oops, try again later.</b>,
        loginError: <b>User not logged in!</b>,
        error: <b>Link already generated!</b>,
      });
    },
    [uploadEmbeddableStaticImage, chart_id]
  );

  useEffect(() => {
    if (!chart_id) {
      return;
    }
    emitter.on(EVENTS.UPLOAD_EMBED_STATIC_IMAGE, uploadStaticImage);

    return () => {
      emitter.off(EVENTS.UPLOAD_EMBED_STATIC_IMAGE, uploadStaticImage);
    };
  }, [uploadStaticImage, chart_id]);

  const redirectToLoginPage = useCallback(() => {
    signinRedirect();
  }, [signinRedirect]);

  const downloadItems: Array<IEmbedChartCard> = useMemo(() => {
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
        isAuthenticated,
        redirectToLoginPage,
      },
      {
        label: 'Download PNG',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/png.png" alt="Export To" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_PNG);
        },
        isAuthenticated,
        redirectToLoginPage,
      },
      {
        label: 'Download JPG',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/jpg.png" alt="Export To JPG" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_JPG);
        },
        isAuthenticated,
        redirectToLoginPage,
      },
      {
        label: 'Download PDF',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/pdf.png" alt="Export To PDF" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_PDF);
        },
        isAuthenticated,
        redirectToLoginPage,
      },
    ];
  }, [isAuthenticated, redirectToLoginPage]);

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

  const embedItems: Array<IEmbedChartCard> = useMemo(() => {
    return [
      {
        label: 'Generate Static Embedable Image',
        icon: <CloudCog className="size-6" aria-hidden={true} />,
        image: <img src="/url.png" alt="Generate Link" className="h-6" />,
        onClick: () => {
          generateEmbedableCharts(EMBEDDABLES.STATIC_IMAGE);
        },
        userLoginCheck: true,
        url: embedLinks.image.url,
        loading: embedLinks.image.loading, //!chart_id || imageURL?.length > 0 ? false : true,
        disabled: embedLinks.image.disabled,
        isAuthenticated,
        redirectToLoginPage,
        chart_id,
        linkType: EMBEDDABLES.STATIC_IMAGE,
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
        url: embedLinks.iframe.url,
        loading: embedLinks.iframe.loading, //!chart_id || iframeURL?.length > 0 ? false : true,
        disabled: embedLinks.image.disabled,
        isAuthenticated,
        redirectToLoginPage,
        chart_id,
        linkType: EMBEDDABLES.DYNAMIC_IFRAME,
      },
    ];
  }, [
    embedLinks.image.url,
    embedLinks.image.loading,
    embedLinks.image.disabled,
    embedLinks.iframe.url,
    embedLinks.iframe.loading,
    isAuthenticated,
    redirectToLoginPage,
    chart_id,
    generateEmbedableCharts,
  ]);

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
            {downloadItems.map((item: IEmbedChartCard) => (
              <EmbedChartCard key={item.label} {...item} />
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
            {embedItems.map((item: IEmbedChartCard) => (
              <EmbedChartCard key={item.label} {...item} />
            ))}
          </>
        ),
      },
    ];
  }, [downloadItems, embedItems]);

  return (
    <div className="mt-4">
      <CWTabs defaultSelected={tabList[0]['id']} tabList={tabList} />
    </div>
  );
}

export default ExportChart;
