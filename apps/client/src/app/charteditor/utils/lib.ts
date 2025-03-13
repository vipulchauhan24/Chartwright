import { jsPDF } from 'jspdf';

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
