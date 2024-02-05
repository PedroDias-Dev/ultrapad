import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1
      className="text-neutral-50"
      >ultra-notes</h1>
      <h3 className="text-teal-400">
        pretty and simple notes
      </h3>

      <h3 className="text-neutral-50">
        made by{" "}
        <a href="" target="_blank" rel="noopener noreferrer" className="underline text-teal-800">
          <strong>siad</strong>
        </a>{" "}
        for siad usage only
      </h3>

      <Link href="/auth/login">
        <Button variant="outline">Login</Button>
      </Link>
    </main>
  );
}
