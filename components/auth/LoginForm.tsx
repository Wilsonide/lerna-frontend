"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CardWrapper } from "./card-wrapper";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Axios } from "@/lib/axios";
import useAuth from "@/app/hooks/useAuth";
import { loginSchema } from "@/schemas";

export const LoginForm = () => {
  const { setAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "/";
  const inviteToken = searchParams.get("invite_token");
  const urlError = searchParams.get("oauth_error") || "";

  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await Axios.post("/auth/login", values, {
        params: inviteToken ? { invite_token: inviteToken } : {},
      });

      if (res.data?.twoFactor) {
        setShowTwoFactor(true);
        return;
      }

      setAuth((prev: any) => ({ ...prev, ...res.data }));
      setSuccess(res.data.success);

      router.replace(from);
    } catch (err: any) {
      setError(err.response?.data?.detail || "No Server Response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonLink="Signup"
      backButtonHref="/auth/register"
      headerTitle="Login here"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          {/* TWO FACTOR */}
          {showTwoFactor && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Two-Factor Code</label>
              <Input
                {...form.register("code")}
                placeholder="Enter 6-digit code"
                disabled={loading}
              />
              {form.formState.errors.code && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>
          )}

          {/* EMAIL + PASSWORD */}
          {!showTwoFactor && (
            <>
              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={loading}
                  {...form.register("password")}
                />

                <div className="mt-2 text-right">
                  <a
                    href="/auth/reset"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ERRORS */}
        <FormError message={error || urlError} />
        <FormSuccess message={success} />

        {/* BUTTON */}
        <Button
          className="w-full py-3 text-lg font-semibold rounded-xl"
          type="submit"
          disabled={loading}
        >
          {showTwoFactor ? "Confirm" : "Login"}
        </Button>
      </form>
    </CardWrapper>
  );
};
