"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FileCard } from "@/components/cloud/filecard";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
  };

  const upload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    setLoading(false);
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold">☁️ My Home Cloud</h1>
          <p className="text-muted-foreground">
            Store and access your files remotely.
          </p>
        </div>

        <Separator />

        {/* Upload */}
        <div className="flex gap-4 items-center">
          <Input
            type="file"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <Button onClick={upload} disabled={loading}>
            <Upload size={16} className="mr-2" />
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {/* Files Grid */}
        {files.length === 0 ? (
          <p className="text-muted-foreground">
            No files uploaded yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {files.map((file) => (
              <FileCard key={file} filename={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
