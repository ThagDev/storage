import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Successfully Logged In</CardTitle>
                    <CardDescription>You have successfully verified your email and logged in</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-500">
                        This is a protected dashboard page that would normally show user-specific content.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full">
                            Back to Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
