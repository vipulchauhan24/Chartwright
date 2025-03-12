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

      // Convert the canvas to a JPEG base64 string
      const jpgBase64 = canvas.toDataURL(type, 1.0);

      resolve(jpgBase64);
    };

    img.onerror = (err) => reject(err);
  });
}
