"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [note, setNote] = useState("note/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-neutral-50 font-bold">ultra-notes</h1>
      <h3 className="text-teal-400">pretty and simple notes</h3>

      <div className="flex flex-col gap-1 items-center justify-center mx-5">
        <h3 className="text-neutral-50">
          looking for a note? type the name here:
        </h3>
        <div className="flex gap-1">
          <Input
            type="text"
            placeholder="type the name of the note"
            className="w-60"
            value={note}
            onChange={(e) => {
              if (e.target.value.length < 5) return;

              setNote(e.target.value);
            }}
          />
          <Button variant="secondary" onClick={() => router.push(`/${note}`)}>
            <ChevronRight className="mr-2 h-4 w-4" />
            go
          </Button>
        </div>
      </div>

      <Link href="/auth/login">
        <Button variant="outline">login</Button>
      </Link>

      <h3 className="text-neutral-50 text-sm mt-5">
        made by{" "}
        <a
          href="https://github.com/PedroDias-Dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-teal-500"
        >
          <strong>siad</strong>
        </a>{" "}
        for siad usage only
      </h3>
    </main>
  );
}
