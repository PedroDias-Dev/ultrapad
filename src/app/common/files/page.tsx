"use client";

import { Button } from "@/components/ui/button";
import { auth, firestore, storage } from "@/firebase/config";
import {
  addDoc,
  collection,
  query,
  setDoc,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionOnce } from "react-firebase-hooks/firestore";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/common/loading";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useAction } from "@/app/hooks/useAction";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export default function Files() {
  const action = useAction();
  const { toast } = useToast();

  const [user] = useAuthState(auth);

  const [value, loading, error] = useCollectionOnce(
    query(collection(firestore, "files"), where("user_uid", "==", user?.uid))
  );

  const inputRef = useRef(null) as any;
  const drop = useRef(null) as any;

  const [files, setFiles] = useState<any[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [progresspercent, setProgresspercent] = useState(0);

  useEffect(() => {
    if (loading || !value) return;

    setFiles(
      value
        ? value.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        : []
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const dropElement = drop.current;
    if (!dropElement) return;
    console.log("🚀 ~ useEffect ~ dropElement:", dropElement);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();

      const { files } = e.dataTransfer;

      if (files && files.length) {
        setFilesToUpload((prev) => [...prev, ...(Array.from(files) as File[])]);
      }
    };

    dropElement.addEventListener("dragover", handleDragOver);
    dropElement.addEventListener("drop", handleDrop);

    return () => {
      dropElement.removeEventListener("dragover", handleDragOver);
      dropElement.removeEventListener("drop", handleDrop);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drop, drop?.current]);

  if (!value || loading) return <Loading />;

  const submitFiles = async () => {
    if (!filesToUpload.length) return;

    let uploadCounter = 0;

    await action(async () => {
      for (const file of filesToUpload) {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgresspercent(progress);
          },
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              addDoc(collection(firestore, "files"), {
                name: file.name,
                url: downloadURL,
                user_uid: user ? user?.uid : "anonymous",
              });

              setFiles((prev) => [
                ...(prev as any),
                { name: file.name, src: downloadURL, user_uid: user?.uid },
              ]);

              uploadCounter++;

              if (uploadCounter === filesToUpload.length) {
                setFilesToUpload([]);
                toast({
                  title: "files uploaded!",
                  description: "your files have been uploaded successfully!",
                });

                setProgresspercent(0);
              }
            });
          }
        );
      }
    });
  };

  return (
    <main className="flex flex-col items-center gap-5 justify-between p-24 text-neutral-50">
      <h1>your files</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Upload</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>upload a file</DialogTitle>
            <DialogDescription>
              drag and drop a file here or click to select a file
            </DialogDescription>

            {progresspercent ? (
              <div className="flex gap-3">
                <Progress value={progresspercent} />
                {progresspercent}%
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-10">
                <input
                  title="upload file"
                  ref={inputRef}
                  className="hidden"
                  type="file"
                  onChange={(e) =>
                    setFilesToUpload((prev) => [
                      ...prev,
                      ...(e.target.files as unknown as File[]),
                    ])
                  }
                />
                <div
                  className="w-full flex items-center justify-center border-2 border-dashed border-neutral-600 p-5 rounded-lg cursor-pointer"
                  onClick={() => inputRef.current.click()}
                  ref={drop}
                >
                  drop file or click here
                </div>

                <div className="flex-col flex gap-5">
                  {filesToUpload.length ? (
                    filesToUpload.map((file, i) => (
                      <div
                        className="min-w-[300px] flex items-center justify-between gap-5 p-3 border-solid border-2 border-neutral-600 rounded-sm "
                        key={i}
                      >
                        {file.name}

                        <div className="flex gap-2 items-center justify-center">
                          <Trash
                            color="red"
                            size={16}
                            className="cursor-pointer"
                            onClick={() =>
                              setFilesToUpload((prev) =>
                                prev.filter((f) => f.name !== file.name)
                              )
                            }
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-500">no files selected</div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full">
                  <DialogClose asChild>
                    <Button variant="secondary">cancel</Button>
                  </DialogClose>

                  <Button
                    disabled={!filesToUpload.length}
                    onClick={() => submitFiles()}
                  >
                    upload
                  </Button>
                </div>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex-col flex gap-5">
        {files.length ? (
          files.map((file) => (
            <div
              className="min-w-[300px] flex items-center justify-between gap-5 p-3 border-solid border-2 border-neutral-600 rounded-sm cursor-pointer hover:bg-neutral-700 transition-all"
              key={file.id}
            >
              {file.name}

              <div className="flex gap-2 items-center justify-center">
                <Download
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    window.open(file.src, "_blank");
                  }}
                />
                <Trash
                  color="red"
                  className="cursor-pointer"
                  size={16}
                  onClick={() => {
                    deleteDoc(doc(firestore, "files", file.id));

                    setFiles((prev) => prev.filter((f) => f.id !== file.id));
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-neutral-500">no files</div>
        )}
      </div>
    </main>
  );
}
