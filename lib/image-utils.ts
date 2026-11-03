/**
 * Client-side image compression and processing for MemoryLane
 * Resizes images and compresses them into high-efficiency JPEG/WebP data URLs
 * to safeguard browser localStorage quota.
 */

export interface ProcessedPhotoResult {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  width: number;
  height: number;
  altText: string;
  sizeBytes: number;
}

export async function processImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<ProcessedPhotoResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not a valid image file.`);
  }

  // Reject files larger than 12MB before decompression
  if (file.size > 12 * 1024 * 1024) {
    throw new Error(`"${file.name}" exceeds the 12MB size limit. Please choose a smaller image.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error(`Failed to read "${file.name}".`));
    };

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error(`Failed to decode image "${file.name}".`));
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Downscale while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context for image processing."));
          return;
        }

        // Apply smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp, fallback to jpeg
        let dataUrl = "";
        let mimeType = "image/jpeg";
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
          mimeType = "image/webp";
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
            mimeType = "image/jpeg";
          }
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          mimeType = "image/jpeg";
        }

        const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
        const approxBytes = Math.ceil((base64Length * 3) / 4);

        resolve({
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          name: file.name,
          mimeType,
          dataUrl,
          width,
          height,
          altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          sizeBytes: approxBytes,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Calculates current localStorage usage in megabytes
 */
export function estimateLocalStorageUsage(): {
  usedBytes: number;
  usedFormatted: string;
  itemCount: number;
} {
  if (typeof window === "undefined" || !window.localStorage) {
    return { usedBytes: 0, usedFormatted: "0 KB", itemCount: 0 };
  }

  let totalChars = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key) || "";
      totalChars += key.length + val.length;
    }
  }

  // In UTF-16, characters take ~2 bytes
  const usedBytes = totalChars * 2;
  const usedKB = (usedBytes / 1024).toFixed(1);
  const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);

  const usedFormatted = usedBytes > 1024 * 1024 ? `${usedMB} MB` : `${usedKB} KB`;

  return {
    usedBytes,
    usedFormatted,
    itemCount: localStorage.length,
  };
}
