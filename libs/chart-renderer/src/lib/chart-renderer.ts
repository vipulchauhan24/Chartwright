import { MESSAGE_TYPES } from './constants';

export class ChartRenderer extends EventTarget {
  /**
   * PRIVATE VARIABLES
   */
  private _iframeInstance: HTMLIFrameElement | undefined;
  private _port: MessagePort | null = null;
  private _chartInitSuccess = false;

  constructor(containerId: string) {
    super();
    this._init(containerId);
  }

  // PUBLIC METHODS.

  /**
   * Set Chart options.
   * @param option Chart config data.
   */
  public renderChart(options: any) {
    this._sendMessage({
      type: MESSAGE_TYPES.RENDER,
      options: options,
    });
  }

  /**
   * Update Chart options.
   * @param option Chart config data.
   */
  public updateChart(options: any) {
    if (!this._chartInitSuccess) {
      return;
    }
    this._sendMessage({
      type: MESSAGE_TYPES.CHART_UPDATE,
      options: options,
    });
  }

  /**
   * Download chart
   * @param uriType 'png' | 'jpeg' | 'svg'
   * @param backgroundColor hex code
   */
  public downloadChart(params: {
    uriType: 'png' | 'jpeg';
    backgroundColor: string;
    copy?: boolean;
    pdf?: boolean;
    upload?: boolean;
    embedId?: string;
  }) {
    this._sendMessage({
      type: MESSAGE_TYPES.CHART_DOWNLOAD,
      ...params,
    });
  }

  /**
   * Dispose chart.
   */
  public disposeChart() {
    this._sendMessage({
      type: MESSAGE_TYPES.CHART_DISPOSE,
    });
  }

  // PRIVATE METHODS.

  private _sendMessage(data: any) {
    this._port?.postMessage(data);
  }

  private _dispatchEvent = (type: MESSAGE_TYPES, detail: any) => {
    const event = new CustomEvent(type, {
      detail: detail,
    });
    this.dispatchEvent(event);
  };

  private _onMessage = (event: any) => {
    switch (event.data.type) {
      case MESSAGE_TYPES.READY:
        this._dispatchEvent(MESSAGE_TYPES.READY, {
          message: 'Chart ready for render!',
        });
        break;
      case MESSAGE_TYPES.CHART_INIT:
        this._dispatchEvent(MESSAGE_TYPES.CHART_INIT, {
          message: 'Chart initialized!',
        });
        break;
      case MESSAGE_TYPES.CHART_FINISHED:
        if (this._chartInitSuccess) {
          break;
        }
        this._chartInitSuccess = true;
        this._dispatchEvent(MESSAGE_TYPES.CHART_FINISHED, {
          message: 'Chart finished!',
        });
        break;
      case MESSAGE_TYPES.CHART_DOWNLOAD:
        this._dispatchEvent(MESSAGE_TYPES.CHART_DOWNLOAD, event.data);
        break;

      default:
        break;
    }
  };

  private _initializeMessageChannel() {
    const channel = new MessageChannel();
    this._port = channel.port1;

    // Listen for messages from iframe
    this._port.onmessage = this._onMessage;

    if (!this._iframeInstance) {
      return;
    }

    this._iframeInstance.onload = () => {
      if (!this._iframeInstance) {
        return;
      }
      this._iframeInstance.contentWindow?.postMessage(
        { type: MESSAGE_TYPES.INIT },
        window.location.origin,
        [channel.port2] // transfer port2
      );
    };
  }

  private _generateIFrame(containerId: string) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', '/chart.html');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'none';

    const container = document.getElementById(containerId);

    if (container) {
      container.appendChild(iframe);
      this._iframeInstance = iframe;
      this._initializeMessageChannel();
    }
  }

  private _init(containerId: string) {
    this._generateIFrame(containerId);
  }
}
