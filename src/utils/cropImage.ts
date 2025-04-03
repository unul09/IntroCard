export async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx) return null;
  
    canvas.width = 512; // 리사이즈 크기
    canvas.height = 512;
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    // 잘라낸 원본 영역 기준
    const sx = pixelCrop.x * scaleX;
    const sy = pixelCrop.y * scaleY;
    const sWidth = pixelCrop.width * scaleX;
    const sHeight = pixelCrop.height * scaleY;
  
    // canvas로 리사이즈
    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, 512, 512);
  
    return canvas.toDataURL('image/jpeg');
  }
  
  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      img.src = url;
    });
  }
  