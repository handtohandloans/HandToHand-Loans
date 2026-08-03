import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';

/**
 * Helper to check if a file is an image
 */
export function isImageFile(file) {
  if (!file) return false;
  return file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
}

/**
 * Helper to check if a file is a PDF
 */
export function isPdfFile(file) {
  if (!file) return false;
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

/**
 * Compress an Image File to under maxSizeKB (default 1024 KB = 1 MB)
 * Returns a File object.
 */
export async function compressImageFile(file, maxSizeKB = 1024) {
  const maxSizeBytes = maxSizeKB * 1024;
  if (!file || file.size <= maxSizeBytes) {
    return file; // Already under limit
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1920;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // White background for PNG transparency conversion
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.92;

        const attemptCompress = (q, currentWidth, currentHeight) => {
          if (currentWidth !== canvas.width || currentHeight !== canvas.height) {
            canvas.width = currentWidth;
            canvas.height = currentHeight;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, currentWidth, currentHeight);
            ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Canvas blob generation failed'));
              }

              if (blob.size <= maxSizeBytes) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                return resolve(compressedFile);
              }

              if (q > 0.15) {
                attemptCompress(q - 0.08, currentWidth, currentHeight);
              } else if (currentWidth > 600 && currentHeight > 600) {
                // Resize canvas to 75% and reset quality
                const newWidth = Math.round(currentWidth * 0.75);
                const newHeight = Math.round(currentHeight * 0.75);
                attemptCompress(0.85, newWidth, newHeight);
              } else {
                // Return best attempt
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            q
          );
        };

        attemptCompress(quality, width, height);
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image data to Base64 (for avatar/profile inline storage)
 */
export async function compressToBase64(file, maxSizeKB = 1024) {
  const maxSizeBytes = maxSizeKB * 1024;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1200;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.90;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (base64.length * 0.75 > maxSizeBytes && quality > 0.15) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(base64);
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress PDF File by re-encoding embedded JPEG/PNG image objects inside pages.
 * Returns a File object.
 */
export async function compressPdfFile(file, maxSizeKB = 1024) {
  const maxSizeBytes = maxSizeKB * 1024;
  if (!file || file.size <= maxSizeBytes) {
    return file; // Already under limit
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    
    // Find indirect objects that are image streams
    let imagesCompressedCount = 0;
    const objects = pdfDoc.context.enumerateIndirectObjects();

    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        const subtype = dict.get(PDFName.of('Subtype'));
        if (subtype === PDFName.of('Image')) {
          const filter = dict.get(PDFName.of('Filter'));
          // Check if image is DCTDecode (JPEG)
          if (filter === PDFName.of('DCTDecode') || (Array.isArray(filter) && filter.includes(PDFName.of('DCTDecode')))) {
            try {
              const imageBytes = obj.getUncompressedContents();
              const blob = new Blob([imageBytes], { type: 'image/jpeg' });
              
              // Compress this embedded image
              const dummyFile = new File([blob], 'embedded.jpg', { type: 'image/jpeg' });
              const compressedImageFile = await compressImageFile(dummyFile, 400); // target ~400KB per image
              
              const compressedBytes = new Uint8Array(await compressedImageFile.arrayBuffer());
              if (compressedBytes.length < imageBytes.length) {
                // Replace stream contents
                obj.contents = compressedBytes;
                dict.set(PDFName.of('Length'), pdfDoc.context.obj(compressedBytes.length));
                imagesCompressedCount++;
              }
            } catch (imgErr) {
              console.warn('Skipping uncompressible PDF embedded image stream:', imgErr);
            }
          }
        }
      }
    }

    const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });

    const finalFile = new File([compressedBlob], file.name, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });

    console.log(`PDF Compression result for ${file.name}: Original ${(file.size / 1024 / 1024).toFixed(2)}MB -> Compressed ${(finalFile.size / 1024 / 1024).toFixed(2)}MB (${imagesCompressedCount} images recompressed)`);

    return finalFile;
  } catch (err) {
    console.warn('PDF compression skipped/failed (returning original file):', err.message);
    return file; // Return original if compression fails or format is unsupported
  }
}

/**
 * Universal compressFile entry point for both images and PDFs.
 * Will automatically compress files larger than maxSizeKB (default 1024 KB = 1 MB).
 */
export async function compressFile(file, maxSizeKB = 1024) {
  if (!file) return file;

  const maxSizeBytes = maxSizeKB * 1024;
  if (file.size <= maxSizeBytes) {
    return file; // No compression needed if already under size limit
  }

  if (isPdfFile(file)) {
    return await compressPdfFile(file, maxSizeKB);
  }

  if (isImageFile(file)) {
    return await compressImageFile(file, maxSizeKB);
  }

  return file;
}
