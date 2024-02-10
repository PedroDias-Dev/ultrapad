"use client";

import Loading from "@/components/common/loading";
import { firestore } from "@/firebase/config";
import {
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useDebounceValue } from "usehooks-ts";

export default function Page({ params }: { params: { slug: string } }) {
  const [value, loading, error] = useDocumentDataOnce(
    doc(firestore, "notes", params.slug)
  );

  const [text, setText] = useState("");
  const [textDebounce, setTextDebounce] = useDebounceValue(text, 300);

  const [lastTyped, setLastTyped] = useState(new Date());

  useEffect(() => {
    if (loading) return;
    if (!text && text !== "") return;

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

    setText(value?.text);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (new Date().getTime() - lastTyped.getTime() > 5000) {
        getDoc(doc(firestore, "notes", params.slug)).then((doc) => {
          setText(doc.data()?.text);
        });

        setLastTyped(new Date());
      }
    }, 1000);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTyped]);

  if (loading)
    return (
      <Loading />
    );

  return (
    <div className="w-full h-screen">
      <textarea
        placeholder="type yo shit twin"
        className="w-full h-full bg-neutral-800 text-neutral-50 resize-none p-3"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setTextDebounce(e.target.value);

          setLastTyped(new Date());
        }}
      ></textarea>
    </div>
  );
}
