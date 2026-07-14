import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Saves one or more uploaded image files to public/uploads on disk
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
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Ensure target directory exists
      await mkdir(uploadDir, { recursive: true });
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      urls.push(`/uploads/${filename}`);
    } catch (error) {
      console.error("Failed to upload image file:", file.name, error);
    }
  }
  
  return urls.join(",");
}
