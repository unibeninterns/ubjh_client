
"use client";

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, CheckCircle, AlertCircle, X, Paperclip } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileType?: string;
  maxFileSize?: number; // in MB
}

export function FileUpload({
  onFileSelect,
  acceptedFileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  maxFileSize = 10,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (file.type !== acceptedFileType) {
      const friendlyTypeName = acceptedFileType.includes('word') ? 'DOCX' : 'file';
      setError(`Only ${friendlyTypeName} files are accepted.`);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size should not exceed ${maxFileSize}MB.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    } else {
      setFile(null);
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    } else {
      setFile(null);
      onFileSelect(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : file
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileType}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />

        {file ? (
          <div className="space-y-3 flex flex-col items-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div className="text-center">
              <p className="font-semibold text-gray-800 break-all">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold"
              >
                Click to upload
              </label>
              <span className="text-gray-600"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              {acceptedFileType.includes('word') ? 'DOCX' : 'File'} up to {maxFileSize}MB
            </p>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
