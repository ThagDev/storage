"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HardDrive, Users, Clock, Star, Trash2, Cloud, Plus, FolderPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploader } from "./file-uploader"

export function DriveSidebar() {
    const pathname = usePathname()
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")

    // Storage usage (for demo purposes)
    const storageUsed = 5.7 // GB
    const storageTotal = 15 // GB
    const storagePercentage = (storageUsed / storageTotal) * 100

    const navItems = [
        {
            name: "My Drive",
            href: "/drive",
            icon: HardDrive,
        },
        {
            name: "Shared with me",
            href: "/drive/shared",
            icon: Users,
        },
        {
            name: "Recent",
            href: "/drive/recent",
            icon: Clock,
        },
        {
            name: "Starred",
            href: "/drive/starred",
            icon: Star,
        },
        {
            name: "Trash",
            href: "/drive/trash",
            icon: Trash2,
        },
    ]

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would create the folder in the database
        console.log(`Creating folder: ${newFolderName}`)
        setNewFolderName("")
        setIsCreateFolderOpen(false)
    }

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex flex-col gap-1 p-4">
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button className="justify-start gap-2">
                            <Plus className="h-4 w-4" />
                            New
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

                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="justify-start gap-2">
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
                                <Label htmlFor="folder-name">Folder Name</Label>
                                <Input
                                    id="folder-name"
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
            </div>

            <nav className="flex-1 overflow-auto p-2">
                <ul className="grid gap-1">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn("w-full justify-start gap-2", pathname === item.href && "bg-gray-100 font-medium")}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Storage</span>
                </div>
                <div className="mb-1 flex items-center justify-between text-xs">
                    <span>
                        {storageUsed.toFixed(1)} GB of {storageTotal} GB used
                    </span>
                    <span>{Math.round(storagePercentage)}%</span>
                </div>
                <Progress value={storagePercentage} className="h-2" />
            </div>
        </div>
    )
}
