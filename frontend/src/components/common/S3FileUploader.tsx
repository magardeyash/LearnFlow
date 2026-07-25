import React, { useRef, useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import api from '../../api/axios';

interface S3FileUploaderProps {
  folder: string;
  accept?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export const S3FileUploader: React.FC<S3FileUploaderProps> = ({
  folder,
  accept = "*/*",
  onUploadSuccess,
  label = "Upload file",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const uploadFileToS3 = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setFileName(file.name);

    try {
      const res = await api.post('/api/upload/presigned-url', {
        fileName: file.name,
        contentType: file.type,
        folder,
      });

      const { presignedUrl, fileUrl } = res.data;

      // Note: We use a vanilla axios client here to upload directly to S3.
      // S3 will reject requests with "Authorization: Bearer <token>" headers,
      // so we make sure to call S3 without our default app headers.
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size;
          const currentProgress = Math.round((progressEvent.loaded * 100) / total);
          setProgress(currentProgress);
        },
      });

      setUploadedUrl(fileUrl);
      onUploadSuccess(fileUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileToS3(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileToS3(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
      
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
          dragActive ? 'border-brand-500 bg-brand-500/5' : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <Upload className="h-8 w-8 text-brand-500 animate-bounce" />
            <span className="text-sm text-slate-300 font-medium">Uploading {fileName}...</span>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mt-2">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold">{progress}%</span>
          </div>
        ) : uploadedUrl ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="h-8 w-8 text-brand-500" />
            <span className="text-sm font-bold text-brand-500">File uploaded successfully!</span>
            <span className="text-xs text-slate-400 truncate max-w-xs">{fileName}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-slate-400" />
            <span className="text-sm text-slate-300 font-medium">
              Drag and drop your file here, or <span className="text-brand-500 hover:underline">browse</span>
            </span>
            <span className="text-xs text-slate-500">Accepts: {accept}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1 font-medium">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
