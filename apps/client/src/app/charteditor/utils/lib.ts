import { jsPDF } from 'jspdf';
import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS } from './constants';

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

export const storeInLocalStorage = (key: LOCAL_STORAGE_KEYS, data: string) => {
  localStorage.setItem(key, data);
};

export const fetchFromLocalStorage = (key: LOCAL_STORAGE_KEYS) => {
  return localStorage.getItem(key) || null;
};

export const removeFromLocalStorage = (key: LOCAL_STORAGE_KEYS) => {
  localStorage.removeItem(key);
};

export const storeInSessionStorage = (
  key: SESSION_STORAGE_KEYS,
  data: string
) => {
  sessionStorage.setItem(key, data);
};

export const fetchFromSessionStorage = (key: SESSION_STORAGE_KEYS) => {
  return sessionStorage.getItem(key) || null;
};

export const removeFromSessionStorage = (key: SESSION_STORAGE_KEYS) => {
  sessionStorage.removeItem(key);
};

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
