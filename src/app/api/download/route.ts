import { NextRequest, NextResponse } from 'next/server';

// This GET function explicitly tells the Next.js compiler worker that this file is a valid server module
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Missing parameters: "url" required.' },
        { status: 400 }
      );
    }

    // Fetch the binary file packet data stream from your Supabase Storage Bucket
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to fetch asset payload from remote storage host.');

    const blob = await response.blob();
    const filename = fileUrl.split('/').pop() || 'application-build.exe';

    // Stream binary payload with headers that force a browser download dialog
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Routing Pipeline Failure: ${error.message}` },
      { status: 500 }
    );
  }
}
