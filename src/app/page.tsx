"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExampleButton } from "@/components/ExampleButton";
import { AuthButton } from "@/components/auth-button";
import { UserApps } from "@/components/user-apps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpenInbox = async () => {
    setIsLoading(true);
    router.push(`/app/new?message=Loading Inbox&template=superhuman`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen p-4 relative">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-lg font-bold flex-1 sm:w-80">
            <a href="https://www.mosaic.dev">mosaic.dev</a>
          </h1>
          <div className="flex items-center gap-2 flex-1 sm:w-80 justify-end">
            <AuthButton />
          </div>
        </div>

        <div>
          <div className="w-full max-w-lg px-4 sm:px-0 mx-auto flex flex-col items-center mt-16 sm:mt-24 md:mt-32 col-start-1 col-end-1 row-start-1 row-end-1 z-10">
            <p className="text-neutral-600 text-center mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
              Welcome to Mosaic
            </p>

            <div className="w-full relative my-5 flex justify-center">
              <Button
                onClick={handleOpenInbox}
                disabled={isLoading}
                size="lg"
                className="w-64 h-12 text-base font-semibold"
              >
                {isLoading ? "Opening..." : "Open your first inbox"}
              </Button>
            </div>
            <Examples />
            <div className="mt-8 mb-16">
              <a
                href="https://mosaic.dev"
                className="border rounded-md px-4 py-2 mt-4 text-sm font-semibold transition-colors duration-200 ease-in-out cursor-pointer w-full max-w-72 text-center block"
              >
                <span className="block font-bold">
                  By <span className="underline">mosaic.dev</span>
                </span>
                <span className="text-xs">
                  AI-powered inbox customization platform.
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t py-8 mx-0 sm:-mx-4">
          <UserApps />
        </div>
      </main>
    </QueryClientProvider>
  );
}

function Examples() {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center gap-2 px-2">
        <ExampleButton
          text="Customize Inbox"
          promptText="I want to customize my inbox layout and colors."
          onClick={(text) => {
            console.log("Example clicked:", text);
          }}
        />
        <ExampleButton
          text="Add Email Filters"
          promptText="Help me set up email filtering and organization rules."
          onClick={(text) => {
            console.log("Example clicked:", text);
          }}
        />
        <ExampleButton
          text="Keyboard Shortcuts"
          promptText="I want to add custom keyboard shortcuts for email actions."
          onClick={(text) => {
            console.log("Example clicked:", text);
          }}
        />
        <ExampleButton
          text="Email Templates"
          promptText="Create some email response templates for common inquiries."
          onClick={(text) => {
            console.log("Example clicked:", text);
          }}
        />
      </div>
    </div>
  );
}
