"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import Image from "next/image";
import {
  CameraIcon,
  CopyIcon,
  MessageCircleIcon,
  Share2Icon,
} from "lucide-react";

type ShareButtonProps = {
  title: string;
  url: string;
  imageUrl?: string;
};

async function fetchClipboardImage(imageUrl: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("image request failed");

  let image = await response.blob();
  if (image.type !== "image/png") {
    const bitmap = await createImageBitmap(image);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas context unavailable");
      context.drawImage(bitmap, 0, 0);
      image = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("image conversion failed"));
        }, "image/png");
      });
    } finally {
      bitmap.close();
    }
  }

  return image;
}

export function ShareButton({ title, url, imageUrl }: ShareButtonProps) {
  async function copy() {
    try {
      if (imageUrl) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": fetchClipboardImage(imageUrl) }),
        ]);
      } else {
        await navigator.clipboard.writeText(url);
      }

      toast.add({
        type: "success",
        title: imageUrl ? "Imagem copiada" : "Link copiado",
      });
    } catch {
      toast.add({
        type: "error",
        title: imageUrl
          ? "Não foi possível copiar a imagem"
          : "Não foi possível copiar o link",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="share-trigger" />
        }
      >
        <Share2Icon />
        Compartilhar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar conteúdo</DialogTitle>
          <DialogDescription>Escolha uma ação.</DialogDescription>
        </DialogHeader>
        {imageUrl ? (
          <Image
            className="share-preview"
            src={imageUrl}
            alt={`Preview: ${title}`}
            width={800}
            height={600}
            unoptimized
          />
        ) : null}
        <div className="share-actions">
          <Button
            className="share-action share-action-whatsapp"
            nativeButton={false}
            render={
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <MessageCircleIcon />
            WhatsApp
          </Button>
          <Button
            className="share-action share-action-instagram"
            nativeButton={false}
            variant="secondary"
            render={
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <CameraIcon />
            Abrir Instagram
          </Button>
          <Button
            className="share-action share-action-copy"
            variant="outline"
            onClick={copy}
          >
            <CopyIcon />
            {imageUrl ? "Copiar imagem" : "Copiar link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
