"use client";

import { Input } from "@/components/ui/shadcn/input";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageUploadInputProps {
  value?: string;
  onChange: (base64: string) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
}) => {
  const [previewImage, setPreviewImage] = useState<Nullable<string>>(
    value ?? null,
  );

  useEffect(() => {
    if (!value) return;

    setPreviewImage(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };

    setPreviewImage(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full items-center gap-1.5 space-y-4 sm:flex">
      <Image
        src={previewImage || "/placeholder.png"}
        alt="Preview"
        width={100}
        height={100}
        className="aspect-square size-48 rounded-md border object-cover"
      />
      <Input type="file" onChange={handleFileChange} />
    </div>
  );
};
