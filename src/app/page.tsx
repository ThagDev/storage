import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database, HardDrive, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-4 md:px-6 ">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <HardDrive className="h-6 w-6" />
              <span className="font-bold">THKH_STORAGE</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" className="cursor-pointer">
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Store, share, and access your files from anywhere
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    A simple and secure way to store your files in the cloud.
                    Upload, organize, and share your files with ease.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <Upload className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">Upload Files</h3>
                    <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                      Easily upload your files to the cloud
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <Database className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">Organize</h3>
                    <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                      Create folders to keep your files organized
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                    <HardDrive className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">Access Anywhere</h3>
                    <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                      Access your files from any device
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} DriveClone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
