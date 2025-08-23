"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
}

interface FileUploadZoneProps {
  uploadedFiles: UploadedFile[]
  onFilesSelected: (files: File[]) => void
  onFileRemove: (id: string) => void
  onClearAll: () => void
}

export function FileUploadZone({ 
  uploadedFiles, 
  onFilesSelected, 
  onFileRemove,
  onClearAll
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    onFilesSelected(files)
  }, [onFilesSelected])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onFilesSelected(files)
    // Reset input value to allow re-selecting the same file
    if (e.target) {
      e.target.value = ""
    }
  }, [onFilesSelected])

  const removeFile = useCallback((id: string) => {
    onFileRemove(id)
  }, [onFileRemove])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver ? "border-foreground bg-muted" : "border-border hover:border-foreground/50 hover:bg-muted",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-semibold">Upload Knowledge</h3>
                <p className="font-body text-muted-foreground">
                  Drag & drop or{" "}
                  <label className="text-foreground font-semibold cursor-pointer hover:underline">
                    choose files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".csv,.json,.pdf,.xlsx,.xls,.txt,.md,.docx,.pptx"
                      onChange={handleFileSelect}
                    />
                  </label>{" "}
                  to upload.
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Supported formats: csv, json, pdf, xlsx, xls, txt, md, docx, pptx
                </p>
                <p className="font-body text-sm text-muted-foreground">Max 5 files per upload.</p>
              </div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-body font-medium">Selected Files</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-body font-medium text-sm">{file.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button className="font-body">Upload Files</Button>
                <Button variant="outline" onClick={onClearAll} className="font-body bg-transparent">
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
