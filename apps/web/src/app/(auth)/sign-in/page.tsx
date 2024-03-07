import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@lux/ui/button";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Sign In | Parsertime`,
  description: `Sign in to your account. Parsertime is a tool for analyzing Overwatch scrims.`,
  openGraph: {
    title: `Sign In | Parsertime`,
    description: `Sign in to your account. Parsertime is a tool for analyzing Overwatch scrims.`,
    url: "https://parsertime.app",
    type: "website",
    siteName: "Parsertime",
    images: [
      {
        url: `https://parsertime.app/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },
};

export default async function AuthenticationPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Sign Up
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-black dark:text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-topography dark:bg-dark-topography" />
        <Link href="/">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src="/parsertime.png"
              alt=""
              width={50}
              height={50}
              className="dark:invert"
            />
            Parsertime
          </div>
        </Link>
        <div className="relative z-20 mt-auto">
          <p className="space-y-2 text-lg">Made with ❤️ by lux.dev</p>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}