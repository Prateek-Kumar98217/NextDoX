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
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(24),
  repeat: z.string().min(6).max(24),
});

export const SignUpForm = () => {
  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      repeat: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.repeat === data.password) {
      await signUp(data.email, data.password);
    } else {
      console.log("Please confirm your password.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="signup-card w-full max-w-md glass-card p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                N
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Create an account</h1>
          <p className="text-muted-foreground mt-2">
            Start your free trial today
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="sign-up-form"
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      id="password"
                      type="password"
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
            <Controller
              name="repeat"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="repeat">Confirm Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      {...field}
                      id="repeat"
                      type="password"
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
              form="sign-up-form"
              className="form-element w-full gap-2 glow-border"
            >
              Create a new account
            </Button>
          </Field>
        </form>
        <p className="form-element text-center text-sm text-muted-foreground mt-6">
          {"Already have an account? "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};
