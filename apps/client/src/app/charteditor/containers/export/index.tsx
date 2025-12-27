import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import {
  ChevronsLeftRightEllipsis,
  CloudCog,
  Copy,
  Download,
} from 'lucide-react';
import { EMBEDDABLES } from '../../utils/lib';
import toast from 'react-hot-toast';
import { allEmbedChartDetails } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { CWTabs } from '@chartwright/ui-components';
import { useParams } from 'react-router-dom';
import EmbedChartCard, { IEmbedChartCard } from './EmbedChartCard';
import useEmbedCharts from '../../hooks/useEmbedCharts';
import { useAuth } from 'react-oidc-context';

function ExportChart() {
  const { chart_id } = useParams();
  const [allEmbedChartData] = useAtom(allEmbedChartDetails);
  const { isAuthenticated } = useAuth();

  const [embedLinks, setEmbedLinks] = useState({
    image: {
      embedId: '',
      loading: true,
      disabled: false,
    },
    iframe: {
      embedId: '',
      loading: true,
      disabled: false,
    },
  });
  const toastrIdRef = useRef('');
  const { savingChanges, uploadEmbeddableStaticImage, embedAsIframe } =
    useEmbedCharts();

  useEffect(() => {
    if (chart_id && allEmbedChartData[chart_id]) {
      const embedImgId = allEmbedChartData[chart_id][EMBEDDABLES.STATIC_IMAGE];
      const embedIIframeId =
        allEmbedChartData[chart_id][EMBEDDABLES.DYNAMIC_IFRAME];

      setEmbedLinks((prev) => {
        return {
          ...prev,
          image: {
            ...prev.image,
            embedId: embedImgId,
            loading: !embedImgId?.length,
          },
          iframe: {
            ...prev.iframe,
            embedId: embedIIframeId,
            loading: !embedIIframeId?.length,
          },
        };
      });
    }

    return () => {
      setEmbedLinks((prev) => {
        return {
          ...prev,
          image: {
            embedId: '',
            loading: false,
            disabled: false,
          },
          iframe: {
            embedId: '',
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
    (event: unknown) => {
      uploadEmbeddableStaticImage({
        event: event as { uri: string },
        chartId: chart_id as string,
        toastrConfig: {
          id: toastrIdRef.current,
          success: <b>Link Generated!</b>,
          apiError: <b>Oops, try again later.</b>,
          loginError: <b>User not logged in!</b>,
          error: <b>Link already generated!</b>,
        },
        embedId: (event as { embedId: string }).embedId,
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
      },
      {
        label: 'Download PNG',
        icon: <Download className="size-6" aria-hidden={true} />,
        image: <img src="/png.png" alt="Export To" className="h-6" />,
        onClick: () => {
          emitter.emit(EVENTS.EXPORT_TO_PNG);
        },
      },
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

  const generateEmbedableLink = useCallback(
    (type: EMBEDDABLES) => {
      if (!isAuthenticated) {
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
      switch (type) {
        case EMBEDDABLES.STATIC_IMAGE:
          emitter.emit(EVENTS.EMBED_STATIC_IMAGE);
          break;
        case EMBEDDABLES.DYNAMIC_IFRAME:
          embedAsIframe({
            chartId: chart_id as string,
            toastrConfig: {
              id: toastrIdRef.current,
              success: <b>Link Generated!</b>,
              apiError: <b>Oops, try again later.</b>,
              loginError: <b>User not logged in!</b>,
              error: <b>Link already generated!</b>,
            },
          });
          break;

        default:
          toast.error('Opps! Error occured.', {
            id: toastrIdRef.current,
          });
          break;
      }
    },
    [chart_id, isAuthenticated, embedAsIframe]
  );

  const embedItems: Array<IEmbedChartCard> = useMemo(() => {
    return [
      {
        label: 'Generate Static Image URL',
        generatedLabel: 'Static Image URL',
        icon: <CloudCog className="size-6" aria-hidden={true} />,
        image: <img src="/url.png" alt="Static URL" className="h-6" />,
        onClick: () => {
          generateEmbedableLink(EMBEDDABLES.STATIC_IMAGE);
        },
        isUserLogged: true,
        embedId: embedLinks.image.embedId,
        loading: embedLinks.image.loading,
        disabled: embedLinks.image.disabled,
        chartId: chart_id,
        linkType: EMBEDDABLES.STATIC_IMAGE,
        toastrIdRef,
      },
      {
        label: 'Generate Interactive IFrame',
        generatedLabel: 'Interactive IFrame',
        icon: <CloudCog className="size-6" aria-hidden={true} />,
        image: (
          <img
            src="/interaction.png"
            alt="Interactive IFrame"
            className="h-6"
          />
        ),
        onClick: () => {
          generateEmbedableLink(EMBEDDABLES.DYNAMIC_IFRAME);
        },
        isUserLogged: true,
        embedId: embedLinks.iframe.embedId,
        loading: embedLinks.iframe.loading,
        disabled: embedLinks.image.disabled,
        chartId: chart_id,
        linkType: EMBEDDABLES.DYNAMIC_IFRAME,
        toastrIdRef,
      },
    ];
  }, [
    embedLinks.image.embedId,
    embedLinks.image.loading,
    embedLinks.image.disabled,
    embedLinks.iframe.embedId,
    embedLinks.iframe.loading,
    chart_id,
    generateEmbedableLink,
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
