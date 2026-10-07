"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import Image from "next/image";
import { CameraIcon, CopyIcon, MessageCircleIcon, Share2Icon } from "lucide-react";

type ShareButtonProps = {
  title: string;
  url: string; imageUrl?: string;
};

export function ShareButton({ title, url, imageUrl }: ShareButtonProps) {
  async function copy() {
    await navigator.clipboard.writeText(imageUrl ?? url);
    toast.add({ type: "success", title: imageUrl ? "Imagem copiada" : "Link copiado" });
  }
  return <Dialog><DialogTrigger render={<Button variant="outline" size="sm" className="share-trigger" />}><Share2Icon />Compartilhar</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Compartilhar conteúdo</DialogTitle><DialogDescription>Escolha uma ação.</DialogDescription></DialogHeader>{imageUrl ? <Image className="share-preview" src={imageUrl} alt={`Preview: ${title}`} width={800} height={600} unoptimized /> : null}<div className="share-actions"><Button nativeButton={false} render={<a href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`} target="_blank" rel="noreferrer" />}><MessageCircleIcon />WhatsApp</Button><Button nativeButton={false} variant="secondary" render={<a href="https://www.instagram.com/" target="_blank" rel="noreferrer" />}><CameraIcon />Abrir Instagram</Button><Button variant="outline" onClick={copy}><CopyIcon />{imageUrl ? "Copiar imagem" : "Copiar link"}</Button></div></DialogContent></Dialog>;
}
