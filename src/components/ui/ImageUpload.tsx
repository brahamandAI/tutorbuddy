import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden inputs */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        aria-label="Upload image from device"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
        aria-label="Capture image from camera"
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => inputRef.current?.click()}
        >
          Upload from Gallery
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => cameraRef.current?.click()}
        >
          Use Camera
        </button>
      </div>

      {preview && (
        <Image src={preview} alt="Preview" width={200} height={160} className="max-h-40 rounded border mt-2" />
      )}
    </div>
  );
}; 