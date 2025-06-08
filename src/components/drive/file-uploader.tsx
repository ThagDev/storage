"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DialogFooter } from "@/components/ui/dialog"

interface FileUploaderProps {
    onUploadComplete: () => void
}

interface UploadingFile {
    id: string
    name: string
    size: number
    progress: number
    status: "uploading" | "success" | "error"
    error?: string
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
    const [files, setFiles] = useState<UploadingFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newFiles = Array.from(selectedFiles).map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: file.size,
            progress: 0,
            status: "uploading" as const,
        }))

        setFiles((prev) => [...prev, ...newFiles])

        // Simulate file upload progress
        newFiles.forEach((file) => {
            const totalTime = Math.random() * 3000 + 1000 // Random time between 1-4 seconds
            const interval = 100
            const steps = totalTime / interval
            let currentStep = 0

            const progressInterval = setInterval(() => {
                currentStep++
                const progress = Math.min((currentStep / steps) * 100, 100)

                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.id === file.id
                            ? {
                                ...f,
                                progress,
                                status: progress === 100 ? "success" : "uploading",
                            }
                            : f,
                    ),
                )

                if (progress === 100) {
                    clearInterval(progressInterval)
                }
            }, interval)
        })
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const handleBrowseClick = () => {
        fileInputRef.current?.click()
    }

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((file) => file.id !== id))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const allUploadsComplete = files.length > 0 && files.every((file) => file.status !== "uploading")

    return (
        <div className="space-y-4">
            <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                    <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <p className="mb-2 text-sm font-medium">
                    Drag and drop files here, or{" "}
                    <button type="button" className="text-blue-600 hover:underline" onClick={handleBrowseClick}>
                        browse
                    </button>
                </p>
                <p className="text-xs text-gray-500">Supports all file types up to 10MB</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Uploading {files.length} file(s)</h4>
                    {files.map((file) => (
                        <div key={file.id} className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 truncate">
                                    {file.status === "success" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : file.status === "error" ? (
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                        <div className="h-4 w-4" />
                                    )}
                                    <span className="truncate text-sm font-medium">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(file.id)}>
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove file</span>
                                    </Button>
                                </div>
                            </div>
                            <Progress value={file.progress} className="mt-2 h-1" />
                            {file.error && <p className="mt-1 text-xs text-red-500">{file.error}</p>}
                        </div>
                    ))}
                </div>
            )}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onUploadComplete}>
                    Cancel
                </Button>
                <Button type="button" disabled={!allUploadsComplete} onClick={onUploadComplete}>
                    {allUploadsComplete ? "Done" : "Uploading..."}
                </Button>
            </DialogFooter>
        </div>
    )
}
