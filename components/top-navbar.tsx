"use client";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Complimate from "@/public/из люстры_2.svg"
import { useFullURL } from "@/hooks/use-full-url";
import { useEffect, useState } from "react";

const TopNavbar: React.FC = () => {
  const { user } = useUser();
  const [url] = useFullURL();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchStars();
  }, []);

  async function fetchStars() {
    const response = await fetch(
      "https://api.github.com/repos/sebastianfdz/jira_clone"
    );
    if (!response.ok) {
      setStars(null);
      return;
    }
    const data = (await response.json()) as { stargazers_count: number };
    setStars(data.stargazers_count ?? null);
  }
  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src={Complimate}
          alt="Complitech Mate"
          width={50}
          height={50}
        />
        <span className="text-sm font-medium text-gray-600">Complitech Mate</span>

      </div>
      {user ? (
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-gray-600">
            {user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? "Guest"}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <div className="flex items-center gap-x-3">
          <div className="rounded-sm bg-inprogress px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">
            <SignInButton mode="modal" redirectUrl={url} />
          </div>
        </div>
      )}
    </div>
  );
};

export { TopNavbar };
