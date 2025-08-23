import { createApp } from "@/actions/create-app";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

// This page is never rendered. It is used to:
// - Force user login without losing the user's initial message and template selection.
// - Force a loading page to be rendered (loading.tsx) while the app is being created.
export default async function NewAppRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
  params: Promise<{ id: string }>;
}) {
  const user = await getUser().catch(() => undefined);
  const search = await searchParams;

  if (!user) {
    // If no user, redirect to home page with a message to sign in first
    redirect(`/?message=Please sign in to create your first inbox`);
  }

  let message: string | undefined;
  if (Array.isArray(search.message)) {
    message = search.message[0];
  } else {
    message = search.message;
  }

  const { id } = await createApp({
    initialMessage: decodeURIComponent(message),
    templateId: search.template as string,
  });

  redirect(`/app/${id}`);
}
