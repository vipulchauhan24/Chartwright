import { CWIconButton } from '@chartwright/ui-components';
import {
  Asterisk,
  Copy,
  ExternalLink,
  LogIn,
  RefreshCw,
  Trash,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { copyToMemory, EMBEDDABLES } from '../../../utils/lib';
import useEmbedCharts from '../../../hooks/useEmbedCharts';
import { EVENTS } from '../../../utils/events';
import emitter from '../../../../../service/eventBus';
import { useAuth } from 'react-oidc-context';

const { VITE_API_BASE_URL, VITE_APP_BASE_URL } = import.meta.env;

export interface IEmbedChartCard {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  image: React.ReactNode;
  generatedLabel?: string;
  isUserLogged?: boolean;
  embedId?: string;
  loading?: boolean;
  linkType?: EMBEDDABLES;
  chartId?: string;
  disabled?: boolean;
  toastrIdRef?: React.RefObject<string>;
}

const EXPORT_ERROR_MSG = 'Oops, try again later.';

function EmbedChartCard(props: IEmbedChartCard) {
  const {
    loading,
    isUserLogged,
    image,
    label,
    embedId,
    icon,
    onClick,
    linkType,
    chartId,
    disabled,
    toastrIdRef,
    generatedLabel,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { deleteEmbeddedLink } = useEmbedCharts();
  const { isAuthenticated, signinRedirect } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const redirectToLoginPage = useCallback(() => {
    signinRedirect();
  }, [signinRedirect]);

  const LoginRequiredComp = useCallback(() => {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-between px-4 z-10 opacity-0 hover:opacity-100 rounded-md">
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

  const embedURL = useMemo(() => {
    switch (linkType) {
      case EMBEDDABLES.STATIC_IMAGE:
        return `${VITE_API_BASE_URL}/api/embed/static-image/${embedId}`;
      case EMBEDDABLES.DYNAMIC_IFRAME:
        return `${VITE_APP_BASE_URL}/embed.html?id=${embedId}`;
      default:
        return '';
    }
  }, [linkType, embedId]);

  const onCopyEmbedRequested = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const blob = new Blob([embedURL], {
            type: 'text/plain',
          });
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
  }, [embedURL]);

  const onDeleteEmbedRequested = useCallback(() => {
    deleteEmbeddedLink(
      linkType as EMBEDDABLES,
      embedId as string,
      chartId as string,
      {
        loading: 'Deleting Link...',
        success: <b>Deleted Successfully!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, [chartId, deleteEmbeddedLink, linkType, embedId]);

  const onRegenerateEmbedRequested = useCallback(() => {
    switch (linkType) {
      case EMBEDDABLES.STATIC_IMAGE:
        if (!isAuthenticated) {
          toast.error(<b>User not logged in.</b>);
          return;
        } else if (!chartId) {
          toast.error(
            <b>
              Chart not saved. Please save chart once or load any saved chart.
            </b>
          );
          return;
        }

        if (toastrIdRef) {
          toastrIdRef.current = toast.loading('Generating embedable link...');
        }

        if (embedId) {
          emitter.emit(EVENTS.EMBED_STATIC_IMAGE, { embedId });
        } else {
          toast.error(<b>Opps, Please try later!</b>);
        }

        break;

      default:
        break;
    }
  }, [linkType, isAuthenticated, chartId, toastrIdRef, embedId]);

  const onViewEmbedRequested = useCallback(() => {
    window.open(embedURL, '_blank');
  }, [embedURL]);

  return (
    <div className="bg-app py-3 px-4 rounded-md mb-4 border border-default relative">
      {!isAuthenticated && isUserLogged && <LoginRequiredComp />}
      {!embedId?.length && !isLoading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {image}
            <p className="font-semibold">{label}</p>
          </div>
          <CWIconButton
            icon={icon}
            onClick={onClick}
            disabled={!!embedId || isLoading || disabled}
            aria-label={label}
          />
        </div>
      )}
      {isLoading && (
        <>
          <div className="h-4 w-2/3 animate-pulse bg-black/20 rounded-xl mt-4"></div>
          <div className="h-3 w-1/3 animate-pulse bg-black/20 rounded-xl mt-1"></div>
        </>
      )}
      {!!embedId?.length && !isLoading && (
        <div className="flex items-center justify-between mt-2 w-full">
          <div className="flex items-center gap-4">
            {image}
            <p className="font-semibold">{generatedLabel}</p>
          </div>
          <div className="flex items-center gap-4">
            <CWIconButton
              tooltip="View"
              icon={<ExternalLink className="size-4" aria-hidden={true} />}
              disabled={disabled}
              onClick={onViewEmbedRequested}
            />
            <CWIconButton
              tooltip="Copy"
              icon={<Copy className="size-4" aria-hidden={true} />}
              disabled={disabled}
              onClick={onCopyEmbedRequested}
            />
            <CWIconButton
              tooltip="Delete"
              icon={<Trash className="size-4" aria-hidden={true} />}
              disabled={disabled}
              onClick={onDeleteEmbedRequested}
            />
            {linkType == EMBEDDABLES.STATIC_IMAGE && (
              <CWIconButton
                tooltip="Re-generate"
                icon={<RefreshCw className="size-4" aria-hidden={true} />}
                disabled={disabled}
                onClick={onRegenerateEmbedRequested}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(EmbedChartCard);
