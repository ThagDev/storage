"use client"

import { useState } from "react"
import { Share2, Copy, Check, Plus, X } from "lucide-react"

import type { FileItem } from "@/lib/file-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ShareDialogProps {
    isOpen: boolean
    onClose: () => void
    file: FileItem | null
}

interface SharedUser {
    id: string
    name: string
    email: string
    access: "view" | "edit" | "comment"
}

export function ShareDialog({ isOpen, onClose, file }: ShareDialogProps) {
    const [linkCopied, setLinkCopied] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [newAccess, setNewAccess] = useState<"view" | "edit" | "comment">("view")
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
        {
            id: "1",
            name: "Alex Johnson",
            email: "alex@example.com",
            access: "edit",
        },
    ])

    const handleCopyLink = () => {
        // In a real app, you would generate and copy a sharing link
        navigator.clipboard.writeText(`https://clouddrive.example.com/share/${file?.id}`)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
    }

    const handleAddUser = () => {
        if (!newEmail || !newEmail.includes("@")) return

        const newUser: SharedUser = {
            id: Math.random().toString(36).substring(2, 9),
            name: newEmail.split("@")[0],
            email: newEmail,
            access: newAccess,
        }

        setSharedUsers([...sharedUsers, newUser])
        setNewEmail("")
    }

    const handleRemoveUser = (id: string) => {
        setSharedUsers(sharedUsers.filter((user) => user.id !== id))
    }

    const handleChangeAccess = (id: string, access: "view" | "edit" | "comment") => {
        setSharedUsers(sharedUsers.map((user) => (user.id === id ? { ...user, access } : user)))
    }

    if (!file) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share `{file.name}`
                    </DialogTitle>
                    <DialogDescription>Share this {file.type} with others by adding their email address</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                        <Input
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Add people by email"
                            className="flex-1"
                        />
                        <Select value={newAccess} onValueChange={(value) => setNewAccess(value as "view" | "edit" | "comment")}>
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="view">Viewer</SelectItem>
                                <SelectItem value="comment">Commenter</SelectItem>
                                <SelectItem value="edit">Editor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleAddUser}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">People with access</h4>
                        <div className="space-y-2">
                            {sharedUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={user.access}
                                            onValueChange={(value) => handleChangeAccess(user.id, value as "view" | "edit" | "comment")}
                                        >
                                            <SelectTrigger className="h-8 w-24">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="view">Viewer</SelectItem>
                                                <SelectItem value="comment">Commenter</SelectItem>
                                                <SelectItem value="edit">Editor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500"
                                            onClick={() => handleRemoveUser(user.id)}
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Remove user</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">General access</h4>
                        <div className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-gray-100 p-1">
                                    <Share2 className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Anyone with the link</p>
                                    <p className="text-xs text-gray-500">Anyone who has the link can view</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1" onClick={handleCopyLink}>
                                {linkCopied ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        Copy link
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
