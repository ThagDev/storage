import { EmailLoginForm } from "./email-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (accessToken) {
    redirect("/drive");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login with Email</CardTitle>
          <CardDescription>
            Enter your email address to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
