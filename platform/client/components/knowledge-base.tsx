"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, FileText, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileUploadZone, UploadedFile } from "@/components/file-upload-zone"
import { cn } from "@/lib/utils"

type KnowledgeStatus = 'Uploading' | 'Processing' | 'Ready' | 'Error'

interface KnowledgeItem extends UploadedFile {
  status: KnowledgeStatus
  uploadedAt: Date
}

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const filteredItems = knowledgeItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFilesSelected = (files: File[]) => {
    const newItems: KnowledgeItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown',
      status: 'Ready' as const,
      uploadedAt: new Date()
    }))
    
    setKnowledgeItems(prev => [...prev, ...newItems])
  }

  const handleDelete = (id: string) => {
    setKnowledgeItems(prev => prev.filter(item => item.id !== id))
  }

  const handleClearAll = () => {
    setKnowledgeItems([])
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">Import and manage your knowledge files.</p>
      </div>

      <FileUploadZone 
        uploadedFiles={knowledgeItems}
        onFilesSelected={handleFilesSelected}
        onFileRemove={handleDelete}
        onClearAll={handleClearAll}
      />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-foreground">Your Files</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Knowledge table */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-3 gap-8 text-sm font-medium text-muted-foreground border-b pb-2">
            <div>File Name</div>
            <div>Type</div>
            <div className="text-right">Status</div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {knowledgeItems.length === 0 
                ? 'No files uploaded yet. Drag and drop files above to get started.' 
                : 'No files match your search.'}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="grid grid-cols-3 gap-8 items-center py-3 group">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate" title={item.name}>{item.name}</span>
                </div>
                <div className="text-muted-foreground text-sm">
                  {item.type} {item.size && `(${formatFileSize(item.size)})`}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Badge 
                    className={cn(
                      "text-xs px-2 py-0.5",
                      item.status === 'Ready' 
                        ? 'bg-green-100 text-green-700' 
                        : item.status === 'Error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {item.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
