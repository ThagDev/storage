import type { ReactNode } from "react"
import { DriveSidebar } from "@/components/drive/drive-sidebar"
import { DriveHeader } from "@/components/drive/drive-header"

export default function DriveLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <DriveHeader />
            <div className="flex flex-1 overflow-hidden">
                <DriveSidebar />
                <main className="flex-1 overflow-auto bg-gray-50 p-4">{children}</main>
            </div>
        </div>
    )
}
