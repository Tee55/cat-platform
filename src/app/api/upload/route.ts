import { NextRequest, NextResponse } from 'next/server';
import { scanResultService } from '@/server/api/services/scan-result';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files').filter(f => f instanceof File) as File[];
  if (!files.length) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }
  try {
    let result;
    if (files.length === 1) {
      const file = files[0];
      if (!file) throw new Error('File is undefined');
      result = await scanResultService.uploadSingleFile(file);
    } else {
      result = await scanResultService.uploadMultipleFiles(files);
    }
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
  }
} 