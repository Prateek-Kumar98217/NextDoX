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

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(24),
});

export const LoginForm = () => {
  const { user, signInWithGithub, signInWithEmailPassword } = useAuth();

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
    } else {
      //Todo: redirect to home page if user id signed in
    }
  };

  return (
    <main>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form-rhf-demo">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
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
                <FieldLabel htmlFor="form-rhf-demo-title">
                  Avatar Url
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="password"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Field orientation="horizontal">
        <Button type="submit" form="form-rhf-demo">
          Sign In
        </Button>
      </Field>
      <Field>
        <Button onClick={signInWithGithub}>Sign in with Github</Button>
      </Field>
    </main>
  );
};
