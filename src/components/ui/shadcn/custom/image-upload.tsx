"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/shadcn/input"
import Image from "next/image"

export function InputImage({ onChange }: { onChange: (base64: string) => void }) {
  const [image, setImage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImage(result)
        onChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {isClient && (
        <>
          <Input type="file" onChange={handleFileChange} />
          {image && (
            <div className="mt-4">
              <Image
                src={image}
                alt="Preview"
                width={100}
                height={100}
                className="border rounded max-h-48 object-contain"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
