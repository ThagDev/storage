"use client"

import { useState } from "react"
import Link from "next/link"
// import { usePathname } from "next/navigation"
import { MoreVertical, FileText, ImageIcon, File, Folder, Star, Download, Share2, Trash2, Info } from "lucide-react"
import type { FileItem } from "@/lib/file-service"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import NextImage from "@/components/ui/next-image"

const ShareDialog = dynamic(() => import("./share-dialog").then(mod => mod.ShareDialog), { ssr: false })

export function FileGrid({ files }: { files: FileItem[] }) {
    // const pathname = usePathname()
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

    if (files.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                    <File className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No files found</h3>
                <p className="text-sm text-gray-500">Upload files or create folders to see them here</p>
            </div>
        )
    }

    const getFileIcon = (file: FileItem) => {
        if (file.type === "folder") {
            return <Folder className="h-16 w-16 text-yellow-400" />
        }
        // Nếu là ảnh và có url, hiển thị ảnh thumbnail tối ưu với next/image
        if ((file.mimeType === "image/jpeg" || file.mimeType === "image/png" || file.mimeType === "image/gif") && file.url) {
            return (
                <NextImage
                    src={file.url}
                    alt={file.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover rounded"
                    style={{ objectFit: 'cover' }}
                />
            )
        }
        let IconComponent = File
        let iconColorClass = "text-gray-400"
        switch (file.mimeType) {
            case "image/jpeg":
            case "image/png":
            case "image/gif":
                IconComponent = ImageIcon
                iconColorClass = "text-blue-500"
                break
            case "application/pdf":
                IconComponent = FileText
                iconColorClass = "text-red-500"
                break
            case "text/plain":
            case "application/msword":
                IconComponent = FileText
                iconColorClass = "text-blue-700"
                break
            default:
                IconComponent = File
                break
        }
        return <IconComponent className={`h-16 w-16 ${iconColorClass}`} />
    }

    const handleFileAction = (action: string, file: FileItem) => {
        switch (action) {
            case "star":
                console.log(`Starring file: ${file.name}`)
                break
            case "download":
                console.log(`Downloading file: ${file.name}`)
                break
            case "share":
                setSelectedFile(file)
                setIsShareDialogOpen(true)
                break
            case "delete":
                console.log(`Deleting file: ${file.name}`)
                break
            case "info":
                setSelectedFile(file)
                setIsInfoDialogOpen(true)
                break
            default:
                break
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {files.map((file) => {
                    const fileUrl = file.type === "folder" ? `/drive/folder${file.path}/${file.name}` : "#"

                    return (
                        <div
                            key={file.id}
                            className="group relative flex flex-col rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="absolute right-2 top-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">More options</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleFileAction("star", file)}>
                                            <Star className="mr-2 h-4 w-4" />
                                            <span>Star</span>
                                        </DropdownMenuItem>
                                        {file.type !== "folder" && (
                                            <DropdownMenuItem onClick={() => handleFileAction("download", file)}>
                                                <Download className="mr-2 h-4 w-4" />
                                                <span>Download</span>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => handleFileAction("share", file)}>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            <span>Share</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleFileAction("delete", file)} className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleFileAction("info", file)}>
                                            <Info className="mr-2 h-4 w-4" />
                                            <span>Details</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="mb-4 flex h-32 items-center justify-center">{getFileIcon(file)}</div>

                            <div className="mt-auto">
                                <Link href={fileUrl} className="block">
                                    <h3 className="truncate font-medium">{file.name}</h3>
                                </Link>
                                <p className="text-xs text-gray-500">{file.type === "folder" ? "Folder" : file.mimeType}</p>
                                <p className="text-xs text-gray-500">{new Date(file.modifiedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <ShareDialog isOpen={isShareDialogOpen} onClose={() => setIsShareDialogOpen(false)} file={selectedFile} />

            <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>File Details</DialogTitle>
                        <DialogDescription>Information about {selectedFile?.name}</DialogDescription>
                    </DialogHeader>

                    {selectedFile && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                                {selectedFile.type === "folder" ? (
                                    <Folder className="h-10 w-10 text-yellow-400" />
                                ) : (
                                    (() => {
                                        let IconComponent = File

                                        switch (selectedFile.mimeType) {
                                            case "image/jpeg":
                                            case "image/png":
                                            case "image/gif":
                                                IconComponent = ImageIcon
                                                break
                                            case "application/pdf":
                                            case "text/plain":
                                            case "application/msword":
                                                IconComponent = FileText
                                                break
                                            default:
                                                IconComponent = File
                                                break
                                        }

                                        return <IconComponent className="h-10 w-10" />
                                    })()
                                )}
                                <div>
                                    <h3 className="font-medium">{selectedFile.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedFile.type === "folder" ? "Folder" : selectedFile.mimeType}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-1">
                                    <span className="text-sm font-medium">Location:</span>
                                    <span className="text-sm">{selectedFile.path || "/"}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    <span className="text-sm font-medium">Owner:</span>
                                    <span className="text-sm">You</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    <span className="text-sm font-medium">Modified:</span>
                                    <span className="text-sm">{new Date(selectedFile.modifiedAt).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    <span className="text-sm font-medium">Created:</span>
                                    <span className="text-sm">{new Date(selectedFile.createdAt).toLocaleString()}</span>
                                </div>
                                {selectedFile.type !== "folder" && (
                                    <div className="grid grid-cols-2 gap-1">
                                        <span className="text-sm font-medium">Size:</span>
                                        <span className="text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
