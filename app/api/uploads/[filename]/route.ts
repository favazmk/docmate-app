import { NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { getUploadsDir, getBundledUploadsDir } from '@/lib/upload';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename;
    
    // Prevent directory traversal attacks
    if (filename.includes('/') || filename.includes('..')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }
    
    // Persistent uploads dir first, then the copy bundled with the deploy so
    // photos committed to the repo keep working once UPLOADS_DIR is set.
    const dirs = Array.from(new Set([getUploadsDir(), getBundledUploadsDir()]));
    let filepath = '';

    for (const dir of dirs) {
      const candidate = path.join(dir, filename);
      try {
        await access(candidate);
        filepath = candidate;
        break;
      } catch {
        continue;
      }
    }

    if (!filepath) {
      return new NextResponse('File not found', { status: 404 });
    }

    const file = await readFile(filepath);

    let contentType = 'image/jpeg';
    if (filename.endsWith('.png')) contentType = 'image/png';
    else if (filename.endsWith('.webp')) contentType = 'image/webp';
    else if (filename.endsWith('.gif')) contentType = 'image/gif';
    else if (filename.endsWith('.svg')) contentType = 'image/svg+xml';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
