export class ChartRenderer {
  /**
   * PRIVATE VARIABLES
   */
  private _iframeInstance: HTMLIFrameElement | undefined;
  private _iframeLoaded: boolean;
  private _port: MessagePort | null = null;

  constructor(containerId: string) {
    this._iframeLoaded = false;
    this._init(containerId);
  }

  /**
   * PUBLIC METHODS
   */
  sendMessage(data: any) {
    if (!this._iframeLoaded) {
      console.error('Post message failed.');
      return;
    }
    this._port?.postMessage(data);
  }

  /**
   * PRIVATE METHODS
   */
  private _init(containerId: string) {
    console.log('Iframe initialized');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', '/chart.html');
    iframe.setAttribute(
      'sandbox',
      'allow-pointer-lock allow-scripts allow-downloads allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals'
    );
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'none';
    const container = document.getElementById(containerId);

    if (container) {
      container.appendChild(iframe);
      this._iframeInstance = iframe;

      const channel = new MessageChannel();
      this._port = channel.port1;

      // Listen for messages from iframe
      this._port.onmessage = (event) => {
        console.log('Host received:', event);
      };

      iframe.onload = () => {
        this._iframeLoaded = true;
        iframe.contentWindow?.postMessage(
          { type: 'init' },
          window.location.origin,
          [channel.port2] // transfer port2
        );
      };
    }
  }
}
