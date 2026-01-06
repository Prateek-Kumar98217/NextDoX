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
                <FieldLabel htmlFor="form-rhf-demo-title">Password</FieldLabel>
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
          <Controller
            name="repeat"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">
                  Confirm Password
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
          Create a new account
        </Button>
      </Field>
    </main>
  );
};
