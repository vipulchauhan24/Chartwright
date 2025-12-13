import { jsPDF } from 'jspdf';

export enum CHART_TYPES {
  BAR = 'bar',
  COLUMN = 'column',
  LINE = 'line',
  AREA = 'area',
}

export enum EMBEDDABLES {
  STATIC_IMAGE = 'static-image',
  DYNAMIC_IFRAME = 'dynamic-iframe',
}

export function changeBaseStringImageType(baseString: string, type: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = baseString;
    img.crossOrigin = 'Anonymous'; // To handle CORS issues if applicable

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx: CanvasRenderingContext2D = canvas.getContext(
        '2d'
      ) as CanvasRenderingContext2D;

      // Draw the PNG image onto the canvas
      ctx.drawImage(img, 0, 0);

      const jpgBase64 = canvas.toDataURL(type, 1.0);

      resolve(jpgBase64);
    };

    img.onerror = (err) => reject(err);
  });
}

// Function to convert Base64 Image to Base64 PDF
export function base64ImageToBase64PDF(base64Image: string) {
  return new Promise((resolve) => {
    const pdf = new jsPDF(); // Create a new PDF document

    // Add image to the PDF (centered)
    pdf.addImage(base64Image, 'PNG', 10, 10, 180, 160); // Adjust as needed

    // Convert PDF to Base64
    const base64PDF = pdf.output('datauristring'); // Extract Base64 part

    resolve(base64PDF);
  });
}

export function generateRandomNumbers(length: number) {
  const numbers = [];
  for (let i = 0; i < length; i++) {
    numbers.push(Math.floor(Math.random() * 100));
  }
  return numbers;
}

export function generateSeriesForChart(length: number, count: number) {
  return {
    name: `Series ${count + 1}`,
    data: generateRandomNumbers(length),
  };
}

export function generateSeriesForBubbleChart(
  rowLength: number,
  columnLength: number,
  count: number
) {
  const matrix = [];
  for (let indx = 0; indx < rowLength; indx++) {
    matrix.push(generateRandomNumbers(columnLength));
  }
  return {
    name: `Series ${count + 1}`,
    data: matrix,
  };
}

export const fileDownload = (uri: string, name: string) => {
  try {
    const a = document.createElement('a'); //Create <a>
    a.href = uri; //Image Base64 Goes here
    a.download = name; //File name Here
    a.click();
  } catch (error) {
    console.error('Not able to save file at the moment.', error);
    throw error;
  }
};

export const copyToMemory = async (
  data: Record<string, string | Blob | PromiseLike<string | Blob>>
) => {
  try {
    const clipboardItem = new ClipboardItem(data);
    await navigator.clipboard.write([clipboardItem]);
  } catch (error) {
    console.error('Unable to copy.', error);
    throw error;
  }
};

export function base64ToFile(base64: string, filename = 'image.png') {
  const arr: string[] = base64.split(',');

  let mime: RegExpMatchArray | null | string = arr[0].match(/:(.*?);/); // "image/png"
  mime = mime ? mime[1] : 'image/png';

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const isArray = (data: unknown) => {
  return Array.isArray(data);
};

export const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

export function setByPath(
  obj: any,
  path: string,
  value: string | string[] | boolean | number | number[]
) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

export function randomHexColor(): string {
  return (
    '#' +
    Math.floor(Math.random() * 0x1000000)
      .toString(16)
      .padStart(6, '0')
  );
}

/**
 *
 * @param dateStr - any date object or string.
 * @returns "24 January, 2025"
 */
export function generateLocaleDateString(dateStr: string | Date) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
