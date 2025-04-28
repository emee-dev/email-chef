"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { Fingerprint, GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  // Toggle between sign in and sign up flows
  const toggleFlow = () => {
    setFlow(flow === "signIn" ? "signUp" : "signIn");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Email Chef
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              className={cn("flex flex-col gap-6")}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);

                const form = new FormData(e.currentTarget);

                // Set flow
                form.set("flow", flow);

                void signIn("password", form).catch(() => {
                  let toastTitle: string;

                  toastTitle =
                    flow === "signIn"
                      ? "Could not sign in, did you mean to sign up?"
                      : "Could not sign up, did you mean to sign in?";

                  toast({ title: toastTitle, variant: "destructive" });
                  setSubmitting(false);
                });
              }}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {flow === "signIn"
                    ? "Login to your account"
                    : "Create an account"}
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {flow === "signIn"
                    ? "Enter your email below to login to your account"
                    : "Fill in your details below to create a new account"}
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {flow === "signIn" && (
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting
                    ? "Processing..."
                    : flow === "signIn"
                      ? "Login"
                      : "Sign Up"}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn("anonymous")}
                  type="button"
                >
                  <Fingerprint className="size-4 mr-1" />
                  Sign in anonymously
                </Button>
              </div>
              <div className="text-center text-sm">
                {flow === "signIn"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFlow();
                  }}
                >
                  {flow === "signIn" ? "Sign up" : "Login"}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
