import { CWGhostLink, CWIconButton } from '@chartwright/ui-components';
import { Asterisk, Copy, LogIn, RefreshCw, Trash } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { copyToMemory, EMBEDDABLES } from '../../../utils/lib';
import useEmbedCharts from '../../../hooks/useEmbedCharts';
import { EVENTS } from '../../../utils/events';
import emitter from '../../../../../service/eventBus';

const { VITE_API_BASE_URL } = import.meta.env;
export interface IEmbedChartCard {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  image: React.ReactNode;
  isAuthenticated: boolean;
  redirectToLoginPage: () => void;
  userLoginCheck?: boolean;
  url?: string;
  loading?: boolean;
  linkType?: EMBEDDABLES;
  chart_id?: string;
  disabled?: boolean;
  toastrIdRef?: React.RefObject<string>;
}

const EXPORT_ERROR_MSG = 'Oops, try again later.';

function EmbedChartCard(props: IEmbedChartCard) {
  const {
    loading,
    userLoginCheck,
    image,
    label,
    url,
    icon,
    onClick,
    isAuthenticated,
    redirectToLoginPage,
    linkType,
    chart_id,
    disabled,
    toastrIdRef,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { deleteEmbeddedLink } = useEmbedCharts();

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

  const copyLink = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const blob = new Blob([`${VITE_API_BASE_URL}/api/embed/${url}`], {
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
  }, [url]);

  const deleteLink = useCallback(() => {
    deleteEmbeddedLink(
      linkType as EMBEDDABLES,
      url as string,
      chart_id as string,
      {
        loading: 'Deleting Link...',
        success: <b>Deleted Successfully!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, [chart_id, deleteEmbeddedLink, linkType, url]);

  const regenerateLink = useCallback(() => {
    switch (linkType) {
      case EMBEDDABLES.STATIC_IMAGE:
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

        if (toastrIdRef) {
          toastrIdRef.current = toast.loading('Generating embedable link...');
        }

        if (url?.length) {
          const embedId = url.split('/')[url.split('/').length - 1];
          emitter.emit(EVENTS.EMBED_STATIC_IMAGE, { embedId });
        } else {
          toast.error(<b>Opps, Please try later!</b>);
        }

        break;

      default:
        break;
    }
  }, [chart_id, linkType, toastrIdRef, url, isAuthenticated]);

  return (
    <div className="bg-app py-3 px-4 rounded-md mb-4 border border-default relative">
      {!isAuthenticated && userLoginCheck && <LoginRequiredComp />}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {image}
          <p className="font-semibold">{label}</p>
        </div>
        <CWIconButton
          icon={icon}
          onClick={onClick}
          disabled={!!url || isLoading || disabled}
          aria-label={label}
        />
      </div>
      {isLoading && (
        <>
          <div className="h-4 w-2/3 animate-pulse bg-black/20 rounded-xl mt-4"></div>
          <div className="h-3 w-1/3 animate-pulse bg-black/20 rounded-xl mt-1"></div>
        </>
      )}
      {!!url?.length && !isLoading && (
        <div className="flex items-center gap-4 mt-4 w-full">
          <span className="flex items-center gap-1 flex-1">
            <strong>Link: </strong>
            <CWGhostLink
              href={`${VITE_API_BASE_URL}/api/embed/${url}`}
              newTab={true}
              label={<span className="truncate w-56">{url}</span>}
            />
          </span>
          <CWIconButton
            tooltip="Copy link"
            icon={<Copy className="size-4" aria-hidden={true} />}
            disabled={disabled}
            onClick={copyLink}
          />
          <CWIconButton
            tooltip="Delete link"
            icon={<Trash className="size-4" aria-hidden={true} />}
            disabled={disabled}
            onClick={deleteLink}
          />
          <CWIconButton
            tooltip="Re-generate Link"
            icon={<RefreshCw className="size-4" aria-hidden={true} />}
            disabled={disabled}
            onClick={regenerateLink}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(EmbedChartCard);
