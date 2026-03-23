const ONE_MB = 1024 * 1024;

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

function createCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

async function canvasToDataUrl(canvas, quality) {
  if (typeof canvas.convertToBlob === "function") {
    const blob = await canvas.convertToBlob({ type: "image/webp", quality });
    return readAsDataUrl(blob);
  }

  return canvas.toDataURL("image/webp", quality);
}

export async function fileToOptimizedDataUrl(file, options = {}) {
  if (!file) {
    throw new Error("Image file is required");
  }

  const isImage = String(file.type || "").startsWith("image/");
  const isPdf = String(file.type || "").toLowerCase() === "application/pdf";

  if (!isImage && !isPdf) {
    throw new Error("Only image or PDF files are supported");
  }

  if (isPdf) {
    if (file.size > ONE_MB) {
      throw new Error("PDF must be less than 1 MB");
    }
    return readAsDataUrl(file);
  }

  const maxBytes = Number(options.maxBytes || ONE_MB);
  const maxWidth = Number(options.maxWidth || 1440);
  const maxHeight = Number(options.maxHeight || 1440);
  const quality = Number(options.quality || 0.78);

  if (file.size <= maxBytes) {
    return readAsDataUrl(file);
  }

  const imageBitmap = await createImageBitmap(file);
  const ratio = Math.min(maxWidth / imageBitmap.width, maxHeight / imageBitmap.height, 1);
  const targetWidth = Math.max(1, Math.round(imageBitmap.width * ratio));
  const targetHeight = Math.max(1, Math.round(imageBitmap.height * ratio));

  const canvas = createCanvas(targetWidth, targetHeight);
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("Image optimization failed");
  }

  context.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  let output = await canvasToDataUrl(canvas, quality);

  // Final guard in case the compressed output is still large.
  if (output.length > maxBytes * 2) {
    output = await canvasToDataUrl(canvas, Math.max(0.55, quality - 0.2));
  }

  return output;
}
