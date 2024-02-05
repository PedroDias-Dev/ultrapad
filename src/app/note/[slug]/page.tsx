"use client";

import { firestore } from "@/firebase/config";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useDebounceValue } from "usehooks-ts";

export default function Page({ params }: { params: { slug: string } }) {
  const [value, loading, error] = useDocument(
    doc(firestore, "notes", params.slug),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [text, setText] = useState("");
  const [textDebounce, setTextDebounce] = useDebounceValue(text, 300);

  useEffect(() => {
    if (loading || !textDebounce) return;
    setDoc(doc(firestore, "notes", params.slug), {
      text,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDebounce]);

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
          setText(e.target.value);
          setTextDebounce(e.target.value);
        }}
      ></textarea>
    </div>
  );
}
