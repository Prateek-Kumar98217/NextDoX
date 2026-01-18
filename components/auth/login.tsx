"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github, Mail, Lock, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(24),
});

export const LoginForm = () => {
  const { user, signInWithGithub, signInWithEmailPassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      await signInWithEmailPassword(data.email, data.password);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="login-card w-full max-w-md glass-card p-8 rounded-2xl relative z-10">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="login-form"
          className="space-y-4"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  N
                </span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account
            </p>
          </div>
          <Button
            onClick={signInWithGithub}
            variant="outline"
            className="form-element w-full gap-2 mb-6 border-border hover:bg-secondary bg-transparent"
          >
            <Github className="w-5 h-5" />
            Sign in with Github
          </Button>
          <div className="form-element relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="form-element space-y-2"
                >
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="off"
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="form-element space-y-2"
                >
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••••••••••"
                      autoComplete="off"
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="login-form"
              className="form-element w-full gap-2 glow-border"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Field>
        </form>
        <p className="form-element text-center text-sm text-muted-foreground mt-6">
          {"Don't have an account? "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};
