export const mediaExtension: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
};

/** True when file header matches the declared MIME (extension map). */
export function matchesMediaMagic(extension: string, header: Uint8Array): boolean {
  if (header.byteLength < 3) return false;
  if (extension === "jpg") return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  if (extension === "png") {
    return header.byteLength >= 4 && header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  }
  if (extension === "gif") return header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46;
  if (extension === "webp") {
    return (
      header.byteLength >= 12 &&
      header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
      header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50
    );
  }
  if (extension === "mp4") {
    // ISO BMFF: size(4) + 'ftyp'(4) at offset 4
    if (header.byteLength < 8) return false;
    return header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70;
  }
  return false;
}
