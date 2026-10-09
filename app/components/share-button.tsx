"use client";

import { HomeArrow } from "./home-arrow";
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
  videoUrl?: string;
  associatedVideoUrl?: string;
  description?: string;
  credit?: string;
  variant?: "default" | "home" | "listing";
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

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let line = "";

  for (const word of text.trim().split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) lines.push(line);
    line = "";

    for (const character of word) {
      if (
        line &&
        context.measureText(`${line}${character}`).width > maxWidth
      ) {
        lines.push(line);
        line = character;
      } else {
        line += character;
      }
    }
  }

  if (line) lines.push(line);
  return lines;
}

async function createTextStoryImage(title: string, url: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas context unavailable");

  const colors = {
    blue: "#1800d8",
    card: "#1000aa",
    yellow: "#fff14a",
    white: "#f8f7ff",
  };
  const background = context.createLinearGradient(0, 0, 1080, 1920);
  background.addColorStop(0, colors.blue);
  background.addColorStop(1, colors.card);
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  let fontSize = 88;
  let lines: string[] = [];

  while (fontSize >= 42) {
    context.font = `700 ${fontSize}px Arial, sans-serif`;
    lines = wrapCanvasText(context, title, 840);
    if (lines.length * fontSize * 1.3 <= 500) break;
    fontSize -= 4;
  }

  context.font = `700 ${fontSize}px Arial, sans-serif`;
  context.fillStyle = colors.white;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const lineHeight = fontSize * 1.3;
  const firstLineY = 400 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, 540, firstLineY + index * lineHeight, 840);
  });

  context.font = "400 42px Arial, sans-serif";
  const urlLines = wrapCanvasText(context, url, 888);
  const urlLineHeight = 60;
  const firstUrlY =
    1000 - ((urlLines.length - 1) * urlLineHeight) / 2;
  urlLines.forEach((line, index) => {
    context.fillText(line, 540, firstUrlY + index * urlLineHeight, 888);
  });

  context.fillStyle = colors.yellow;
  context.fillRect(96, 1536, 888, 3);
  context.textAlign = "left";
  context.font = "700 34px Arial, sans-serif";
  context.fillText("https://techcontraflaviobolsonaro.dev/", 96, 1610, 888);
  context.fillText("@techcontrabolsonaro.dev", 96, 1670, 888);

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("image generation failed"));
        return;
      }
      resolve(new File([blob], "story.png", { type: "image/png" }));
    }, "image/png");
  });
}

export function ShareButton({ title, url, imageUrl, videoUrl, associatedVideoUrl, description, credit, variant = "default" }: ShareButtonProps) {
  async function shareFile(file: File, text?: string) {
    try {
      if (!navigator.canShare?.({ files: [file] }) || !navigator.share) {
        toast.add({
          type: "error",
          title: "Este navegador não permite compartilhar imagens",
        });
        return;
      }

      await navigator.share({
        files: [file],
        ...(text ? { text } : {}),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      toast.add({
        type: "error",
        title: "Não foi possível compartilhar a imagem",
      });
    }
  }

  async function shareImage(text?: string) {
    if (!imageUrl) return;

    try {
      const image = await fetchClipboardImage(imageUrl);
      const file = new File([image], "image.png", { type: "image/png" });
      await shareFile(file, text);
    } catch {
      toast.add({
        type: "error",
        title: "Não foi possível preparar a imagem",
      });
    }
  }

  async function openWhatsapp() {
    if (imageUrl) {
      await shareImage(`${title}\n\nhttps://techcontraflaviobolsonaro.dev/`);
      return;
    }

    const shareText = `${title}\n${url}\n\nhttps://techcontraflaviobolsonaro.dev/`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function openInstagram() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (imageUrl) {
      await shareImage();
      return;
    }

    try {
      const storyImage = await createTextStoryImage(title, url);
      await shareFile(storyImage);
    } catch {
      toast.add({
        type: "error",
        title: "Não foi possível preparar o conteúdo para o Story",
      });
    }
  }

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
          <Button variant={variant !== "default" ? "default" : "outline"} size={variant !== "default" ? "lg" : "sm"} className="share-trigger" />
        }
      >
        {variant === "default" ? <Share2Icon /> : null}
        Compartilhar
        {variant !== "default" ? <HomeArrow /> : null}
      </DialogTrigger>
      <DialogContent className={variant !== "default" ? "home-share-dialog" : undefined}>
        <DialogHeader>
          <DialogTitle>Compartilhar conteúdo</DialogTitle>
          <DialogDescription>{description ?? "Escolha uma ação."}</DialogDescription>
        </DialogHeader>
        {variant !== "default" ? <p className="home-share-credit">{title}{credit ? ` — ${credit}` : ""}</p> : null}
        {associatedVideoUrl ? <a href={associatedVideoUrl} target="_blank" rel="noreferrer">Abrir vídeo associado</a> : null}
        {videoUrl ? <video className="share-preview" src={videoUrl} controls aria-label={title} /> : null}
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
            onClick={openWhatsapp}
          >
            <MessageCircleIcon />
            Compartilhar via WhatsApp
          </Button>
          <Button
            className="share-action share-action-instagram"
            onClick={openInstagram}
            variant="secondary"
          >
            <CameraIcon />
            Compartilhar via Instagram
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
