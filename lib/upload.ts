import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Directory new uploads are written to.
 *
 * Hosts that deploy into a fresh folder per release (Hostinger Web Apps, Vercel)
 * change process.cwd() on every deploy, so anything written under it is lost.
 * Set UPLOADS_DIR to an absolute path outside the deploy folder to keep uploads.
 */
export function getUploadsDir(): string {
  const configured = process.env.UPLOADS_DIR?.trim();
  return configured ? configured : getBundledUploadsDir();
}

/**
 * public/uploads inside the deployed app — holds images committed to the repo.
 * Still read from so older photos keep working after UPLOADS_DIR is set.
 */
export function getBundledUploadsDir(): string {
  return path.join(process.cwd(), "public/uploads");
}

/**
 * Saves one or more uploaded image files to the uploads directory on disk
 * and returns a comma-separated string of relative file paths.
 */
export async function uploadImages(files: File[]): Promise<string> {
  const urls: string[] = [];
  
  for (const file of files) {
    if (!file || file.size === 0 || !file.name) continue;
    
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate a unique filename using Node's built-in crypto module
      const ext = path.extname(file.name) || ".webp";
      const filename = `${crypto.randomUUID()}${ext}`;
      
      const uploadDir = getUploadsDir();
      
      // Ensure target directory exists
      await mkdir(uploadDir, { recursive: true });
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      urls.push(`/api/uploads/${filename}`);
    } catch (error) {
      console.error("Failed to upload image file:", file.name, error);
    }
  }
  
  return urls.join(",");
}
