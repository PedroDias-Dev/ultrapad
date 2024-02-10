"use client";

import { Code, File, Notebook } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center gap-5 justify-between p-24 text-neutral-50">
      <h1>what do you need?</h1>

      <div className="grid-cols-3 gap-4 grid">
        <div className="flex gap-2 items-center justify-center space-y-4 border-solid border-2 border-neutral-600 p-8 rounded-lg cursor-pointer hover:bg-neutral-700 transition-all" onClick={() => router.push("/common/notes")}>
          <Notebook size={16} />
          your notes
        </div>

        <div className="flex gap-2 items-center justify-center space-y-4 border-solid border-2 border-neutral-600 p-8 rounded-lg cursor-pointer hover:bg-neutral-700 transition-all" onClick={() => router.push("/common/files")}>
          <File size={16} />
          your files
        </div>

        <div className="flex gap-2 items-center justify-center space-y-4 border-solid border-2 border-neutral-600 p-8 rounded-lg cursor-pointer hover:bg-neutral-700 transition-all" onClick={() => router.push("/common/code")}>
          <Code size={16} />
          code snippets
        </div>
      </div>
    </main>
  );
}
