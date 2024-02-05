"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex gap-4 items-center justify-center">
        <Image
          src={user?.photoURL || "/favicon.ico"}
          alt="user avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="text-lg font-bold text-neutral-50">
          {user?.displayName || user?.email}
        </span>

        <Button
          onClick={async () => {
            await signOut(auth);

            router.push("/auth/login");
          }}
        >
          logout
        </Button>
      </div>
      {children}
    </main>
  );
}
