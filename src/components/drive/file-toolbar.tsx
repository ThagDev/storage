"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
// import { usePathname } from "next/navigation"
import { ChevronRight, Grid, List, SortAsc, Upload, FolderPlus, Trash2, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploader } from "@/components/drive/file-uploader"

interface FileToolbarProps {
    currentPath: string
    isSharedView?: boolean
    isStarredView?: boolean
    isTrashView?: boolean
}

export function FileToolbar({
    currentPath,
    isSharedView = false,
    isStarredView = false,
    isTrashView = false,
}: FileToolbarProps) {
    // const pathname = usePathname()
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")

    // Generate breadcrumb segments
    const getBreadcrumbs = () => {
        if (isSharedView) return [{ name: "Shared with me", path: "/drive/shared" }]
        if (isStarredView) return [{ name: "Starred", path: "/drive/starred" }]
        if (isTrashView) return [{ name: "Trash", path: "/drive/trash" }]

        const segments = currentPath.split("/").filter(Boolean)
        const breadcrumbs = [{ name: "My Drive", path: "/drive" }]

        let currentSegmentPath = ""

        segments.forEach((segment) => {
            currentSegmentPath += `/${segment}`
            breadcrumbs.push({
                name: segment,
                path: `/drive/folder${currentSegmentPath}`,
            })
        })

        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs()

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would create the folder in the database
        console.log(`Creating folder: ${newFolderName} at path: ${currentPath}`)
        setNewFolderName("")
        setIsCreateFolderOpen(false)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.path} className="flex items-center">
                        {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-500" />}
                        <Link
                            href={breadcrumb.path}
                            className={index === breadcrumbs.length - 1 ? "font-medium" : "text-gray-600 hover:text-gray-900"}
                        >
                            {breadcrumb.name}
                        </Link>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {!isTrashView ? (
                        <>
                            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-1">
                                        <Upload className="h-4 w-4" />
                                        Upload
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Upload Files</DialogTitle>
                                        <DialogDescription>Select files from your computer to upload to CloudDrive</DialogDescription>
                                    </DialogHeader>
                                    <FileUploader onUploadComplete={() => setIsUploadOpen(false)} />
                                </DialogContent>
                            </Dialog>

                            {!isSharedView && !isStarredView && (
                                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <FolderPlus className="h-4 w-4" />
                                            New Folder
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <form onSubmit={handleCreateFolder}>
                                            <DialogHeader>
                                                <DialogTitle>Create New Folder</DialogTitle>
                                                <DialogDescription>Enter a name for your new folder</DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4">
                                                <Label htmlFor="folder-name-toolbar">Folder Name</Label>
                                                <Input
                                                    id="folder-name-toolbar"
                                                    value={newFolderName}
                                                    onChange={(e) => setNewFolderName(e.target.value)}
                                                    placeholder="Untitled Folder"
                                                    className="mt-2"
                                                    required
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit">Create</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="outline" className="gap-1">
                                <RotateCcw className="h-4 w-4" />
                                Restore
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete Forever
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                                <SortAsc className="h-4 w-4" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Name</DropdownMenuItem>
                            <DropdownMenuItem>Last modified</DropdownMenuItem>
                            <DropdownMenuItem>Size</DropdownMenuItem>
                            <DropdownMenuItem>Type</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center rounded-md border">
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`rounded-r-none ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="h-4 w-4" />
                            <span className="sr-only">Grid view</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`rounded-l-none ${viewMode === "list" ? "bg-gray-100" : ""}`}
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                            <span className="sr-only">List view</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
