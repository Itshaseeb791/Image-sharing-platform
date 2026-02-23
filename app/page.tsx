"use client";

import { useEffect, useState } from "react";
import { Upload, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FileCard } from "@/components/cloud/filecard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // States
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoadingStatus(false);
    }
  }, [router]);

  // Fetch files
  useEffect(() => {
    if (!loadingStatus) {
      fetchFiles();
    }
  }, [loadingStatus]);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(e.target.files || []);

    if (filesArray.length > 30) {
      alert("You can upload maximum 30 images at once.");
      return;
    }

    setSelectedFiles(filesArray);
  };

  const upload = async () => {
    if (selectedFiles.length === 0) return;

    setLoading(true);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file); // IMPORTANT: must match backend
    });

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed");
    }

    setSelectedFiles([]);
    setLoading(false);
    fetchFiles();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loadingStatus) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">☁️ My Home Cloud</h1>
            <p className="text-muted-foreground">
              Store and access your files remotely.
            </p>
          </div>

          <Button variant="outline" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        <Separator />

        {/* Upload Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          <Button onClick={upload} disabled={loading}>
            <Upload size={16} className="mr-2" />
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {/* Selected File Info */}
        {selectedFiles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedFiles.length} file(s) selected
          </p>
        )}

        {/* Files Grid */}
        {files.length === 0 ? (
          <p className="text-muted-foreground">No files uploaded yet.</p>
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