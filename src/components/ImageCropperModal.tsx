import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import { getCroppedImg } from '@/utils/cropImage';

interface ImageCropperModalProps {
  image: string;
  onClose: () => void;
  onComplete: (croppedDataUrl: string) => void;
}

export default function ImageCropperModal({ image, onClose, onComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    if (croppedImage) {
      onComplete(croppedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="relative w-[90vw] max-w-[500px] h-[500px] bg-white rounded shadow">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">취소</button>
          <button onClick={handleCrop} className="text-blue-600 font-semibold">적용</button>
        </div>
      </div>
    </div>
  );
}
