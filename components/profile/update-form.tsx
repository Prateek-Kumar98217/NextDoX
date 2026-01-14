"use client";
//add controller properly in the sections(I probably should use div here tho)
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
import { updateUserProfile } from "@/actions/profile-actions";
import { useEffect } from "react";
import { useUserProfile } from "@/hooks/profile-hook";
import { nullToUndefined } from "@/lib/utils";

const profileUpdateFormSchema = z.object({
  username: z.string().min(3).max(24),
  email: z.email(),
  dev_type: z.string().min(3).max(60),
  skills: z.array(z.string()),
  avatar_url: z.string(),
  urls: z.array(z.url()),
});

export const ProfileUpdateForm = () => {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile(user?.id ?? null);

  const form = useForm<z.infer<typeof profileUpdateFormSchema>>({
    resolver: zodResolver(profileUpdateFormSchema),
    defaultValues: {
      username: "",
      email: "",
      dev_type: "",
      skills: [],
      avatar_url: "",
      urls: [],
    },
  });

  const { reset, register, handleSubmit } = form;

  useEffect(() => {
    if (profile) {
      reset(nullToUndefined(profile));
    }
  }, [profile, reset]);

  const onSubmit = async (data: z.infer<typeof profileUpdateFormSchema>) => {
    if (!user) return;
    await updateUserProfile(user.id, data);
  };

  if (!user || loading) return null; //for now no loading handling loading state

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} id="profile-update-form">
        <FieldGroup>
          <section id="header">
            <div id="avatar">
              <Controller
                name="avatar_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-update-title">
                      Avatar
                    </FieldLabel>
                    <Input
                      {...field}
                      id="profile-update-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="placeholder"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div id="basic-details">
              <div id="username">
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="profile-form-name">
                        Username
                      </FieldLabel>
                      <Input
                        {...field}
                        id="profile-form-name"
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
              </div>
              <div id="email">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="profile-form-email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="profile-form-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="placeholder"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div id="dev_type">
                <Controller
                  name="dev_type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="profile-form-type">
                        Developer Type
                      </FieldLabel>
                      <Input
                        {...field}
                        id="profile-form-type"
                        aria-invalid={fieldState.invalid}
                        placeholder="placeholder"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div id="contact_links"></div>
            </div>
          </section>
          <section id="skills-crarousle-infinite"></section>
          <section id="stats: projects and tasks"></section>
          <section id="heatmap for tasks"></section>
        </FieldGroup>
      </form>
      <Field orientation="horizontal">
        <Button type="submit" form="profile-update-form">
          Update Profile
        </Button>
      </Field>
    </main>
  );
};
