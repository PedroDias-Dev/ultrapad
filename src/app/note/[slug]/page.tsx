"use client";

import { firestore } from "@/firebase/config";
import { getFirestore, collection, doc, addDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

export default function Page({ params }: { params: { slug: string } }) {
  const [value, loading, error] = useDocument(
    doc(firestore, "notes", params.slug),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [text, setText] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!value) {
      setDoc(doc(firestore, "notes", params.slug), {
        text,
      });
    }

    setText(value?.data()?.text);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen">
      <textarea
        placeholder="type yo shit twin"
        className="w-full h-full bg-neutral-800 text-neutral-50 resize-none p-3"
        value={text}
        onChange={(e) => {
          // add text to firebase
          const newText = e.target.value;

          setDoc(doc(firestore, "notes", params.slug), {
            text: newText,
          });

          setText(newText)
        }}
      ></textarea>
    </div>
  );
}
