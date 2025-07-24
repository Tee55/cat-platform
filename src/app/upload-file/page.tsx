// src/app/upload/page.tsx
"use client"

import { useState, useRef, type JSX, type SVGProps } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, FileText, Upload } from "lucide-react"
import { api } from "@/trpc/react" // ต้องใช้ api จาก @/trpc/react

export default function UploadFilePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputKey, setInputKey] = useState(0) // ใช้เพื่อ reset input file
  const formRef = useRef<HTMLFormElement>(null)

  // *** เปลี่ยนมาใช้ tRPC mutation อีกครั้ง ***
  // `api.scanResult.uploadMultipleFiles.useMutation()` จะเรียกใช้ tRPC procedure จริงๆ
  // ไม่ใช่ function `uploadMultipleFiles` ใน `scanResultService.ts` อีกต่อไป
  const { mutate: uploadMultipleFilesTRPC, isPending: isUploadingTRPC } = api.scanResult.uploadMultipleFiles.useMutation({
    onSuccess: (data) => {
      alert("Files uploaded successfully via tRPC!");
      console.log("tRPC Upload Success Data:", data);
      setFiles([]);
      setInputKey(prev => prev + 1); // รีเซ็ต input file
      setError(null);
    },
    onError: (error) => {
      console.error("tRPC Upload Failed:", error);
      setError(`Failed to upload files: ${error.message || 'Unknown error'}`);
      alert(`Failed to upload files: ${error.message || 'Unknown error'}`);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
      // ไม่ต้อง setInputKey ที่นี่ เพราะเราจะรีเซ็ตหลังจากอัปโหลดสำเร็จ
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
      e.dataTransfer.clearData()
    }
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove))
    setError(null)
  }

  const clearAllFiles = () => {
    setFiles([])
    setError(null)
    setInputKey(prev => prev + 1); // รีเซ็ต input file เมื่อล้างทั้งหมด
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    return <FileText className="w-4 h-4 text-blue-500" />
  }

  // *** เปลี่ยน handleSubmit ให้เรียก tRPC mutation โดยตรง ***
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    // เรียก tRPC mutation โดยตรง โดยส่ง `files` array เข้าไป
    // tRPC client จะจัดการ FormData และการส่งไป Backend เอง
    uploadMultipleFilesTRPC({ files: files });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Select one or more files to upload. Supported formats: NESUS, XML, CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ลบ encType="multipart/form-data" ออกจาก form เพราะ tRPC จะจัดการเอง */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Drop Zone */}
            <div
              className={`flex items-center justify-center w-full transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className={`w-10 h-10 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    NESUS, XML, CSV files
                  </p>
                </div>
                <input
                  key={inputKey} // ใช้ key เพื่อบังคับให้ input ถูก re-render และล้างค่า
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-medium px-2 py-1 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Selected Files ({files.length})
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllFiles}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}-${file.lastModified}`}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {file.name.split('.').pop()?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isUploadingTRPC}>
                    {isUploadingTRPC ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {files.length} File{files.length > 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function UploadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}