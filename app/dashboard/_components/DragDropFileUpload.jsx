import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

function DragDropFileUpload({ onFileSelect, selectedFile }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (Optional)</label>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:bg-gray-50",
          selectedFile ? "bg-green-50 border-green-300" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center p-4 text-center">
            <div className="bg-green-100 p-2 rounded-full mb-2">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-4 text-center">
            <Upload className={cn("h-8 w-8 mb-2", dragActive ? "text-primary" : "text-gray-400")} />
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DragDropFileUpload;
