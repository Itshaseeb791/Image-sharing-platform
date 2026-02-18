"use client";

import Image from "next/image";
import { Download, File as FileIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  filename: string;
}

function isImage(file: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file);
}

function isVideo(file: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(file);
}

export function FileCard({ filename }: FileCardProps) {
  const fileUrl = `/uploads/${filename}`;
  const downloadUrl = `/api/download/${filename}`;

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
      <CardContent className="p-4 space-y-4">

        {/* Preview Section */}
        <div className="relative w-full h-48 bg-muted rounded-xl overflow-hidden flex items-center justify-center">

          {isImage(filename) && (
            <Image
              src={fileUrl}
              alt={filename}
              fill
              className="object-cover"
            />
          )}

          {isVideo(filename) && (
            <video
              src={fileUrl}
              className="w-full h-full object-cover"
              controls
            />
          )}

          {!isImage(filename) && !isVideo(filename) && (
            <FileIcon className="w-10 h-10 text-muted-foreground" />
          )}
        </div>

        {/* File Name */}
        <p className="text-sm font-medium truncate">
          {filename}
        </p>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} target="_blank">
              View
            </a>
          </Button>

          <Button size="sm" asChild>
            <a href={downloadUrl}>
              <Download size={14} className="mr-1" />
              Download
            </a>
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
