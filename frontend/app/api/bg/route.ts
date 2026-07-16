import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    const filePath = 'C:\\Users\\Yashasvi\\.gemini\\antigravity-ide\\brain\\a3761410-90f6-4b31-b361-28f9eea7a762\\abstract_3d_bg_1784169854290.png';
    const imageBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error loading background:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
