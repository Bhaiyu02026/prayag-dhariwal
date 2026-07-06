import { NextRequest, NextResponse } from 'next/server';

// This explicitly marks the file as a valid Next.js server module handler
export async function GET(request: NextRequest) {
  try {
    // Extract the file target URL from the incoming query string parameters
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Missing parameters: "url" operand required.' },
        { status: 400 }
      );
    }

    // Fetch the binary packet chunk stream from your Supabase Storage Bucket
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to resolve asset payload from remote storage host.');

    const blob = await response.blob();

    // Extract filename from the path to present to the user's OS filesystem
    const filename = fileUrl.split('/').pop() || 'application-build.exe';

    // Return the binary data stream with explicit browser forcing download headers
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
