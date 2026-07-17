"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Star, Plus } from "lucide-react";

interface PhotoUploaderProps {
  existingPhotoUrl?: string | null;
  fileFieldName: string;
  keptUrlsFieldName: string;
  label: string;
  maxPhotos?: number;
}

export default function PhotoUploader({
  existingPhotoUrl,
  fileFieldName,
  keptUrlsFieldName,
  label,
  maxPhotos = 10,
}: PhotoUploaderProps) {
  const [keptUrls, setKeptUrls] = useState<string[]>(
    existingPhotoUrl ? existingPhotoUrl.split(",").map((s) => s.trim()).filter(Boolean) : []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep the native file input's FileList in sync with newFiles state, since a
  // multi-file input can't have individual entries removed directly.
  useEffect(() => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    newFiles.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }, [newFiles]);

  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  const totalCount = keptUrls.length + newFiles.length;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const picked = Array.from(files).slice(0, Math.max(0, maxPhotos - totalCount));
    setNewFiles((prev) => [...prev, ...picked]);
  };

  const removeKept = (index: number) => {
    setKeptUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const setKeptPrimary = (index: number) => {
    setKeptUrls((prev) => {
      const next = [...prev];
      const [url] = next.splice(index, 1);
      next.unshift(url);
      return next;
    });
  };

  const removeNew = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-text-dark">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        name={fileFieldName}
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input type="hidden" name={keptUrlsFieldName} value={keptUrls.join(",")} />

      <div className="flex flex-wrap gap-3">
        {keptUrls.map((url, i) => (
          <div key={url} className="relative w-16 h-16 rounded-xl border border-gray-border overflow-hidden bg-gray-bg group">
            <Image src={url} alt={`${label} ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeKept(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
            >
              <X className="w-3 h-3" />
            </button>
            {i === 0 ? (
              <span className="absolute top-1 left-1 bg-blue-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                Primary
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setKeptPrimary(i)}
                className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5"
              >
                <Star className="w-2.5 h-2.5" /> Set primary
              </button>
            )}
          </div>
        ))}

        {newPreviews.map((url, i) => (
          <div key={url} className="relative w-16 h-16 rounded-xl border border-gray-border overflow-hidden bg-gray-bg">
            <Image src={url} alt={`New photo ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeNew(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              New
            </span>
          </div>
        ))}

        {totalCount < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-border hover:border-blue-primary text-text-light hover:text-blue-primary flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
      <p className="text-xs text-text-mid">{totalCount} / {maxPhotos} photos. First photo is used as the profile image.</p>
    </div>
  );
}
