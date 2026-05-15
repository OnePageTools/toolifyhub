import { NextRequest, NextResponse } from 'next/server';

/**
 * @fileOverview API Route to fetch and parse YouTube transcripts.
 * This runs on the server to bypass CORS and extract caption data from the YouTube page source.
 */

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('videoId');

  if (!videoId || videoId.length !== 11) {
    return NextResponse.json({ error: 'Valid Video ID is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the YouTube watch page with a real user-agent
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const html = await response.text();

    // 2. Extract the captionTracks data using regex
    const captionMatch = html.match(/"captionTracks":(\[.*?\])/);

    if (!captionMatch) {
      return NextResponse.json(
        { error: 'No captions found for this video. It might be private or have disabled CC.' },
        { status: 404 }
      );
    }

    const captionTracks = JSON.parse(captionMatch[1]);

    // 3. Find the best track (prefer English, fallback to first available)
    const preferredTrack =
      captionTracks.find((track: any) => track.languageCode === 'en') ||
      captionTracks.find((track: any) => track.languageCode.startsWith('en')) ||
      captionTracks[0];

    if (!preferredTrack || !preferredTrack.baseUrl) {
      return NextResponse.json({ error: 'No caption tracks available' }, { status: 404 });
    }

    // 4. Fetch the XML transcript data
    const transcriptResponse = await fetch(preferredTrack.baseUrl);
    const transcriptXml = await transcriptResponse.text();

    // 5. Parse the XML to extract text and timestamps
    const lines = [];
    const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>(.*?)<\/text>/gs;
    let match;

    while ((match = regex.exec(transcriptXml)) !== null) {
      const start = parseFloat(match[1]);
      const text = match[3]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, '') // Remove any internal tags
        .trim();

      if (text) {
        lines.push({
          start: start,
          text: text,
        });
      }
    }

    if (lines.length === 0) {
      return NextResponse.json({ error: 'The transcript content was empty or unreadable' }, { status: 404 });
    }

    return NextResponse.json({
      transcript: lines,
      language: preferredTrack.languageCode,
      videoId: videoId,
    });
  } catch (error: any) {
    console.error('Transcript API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch or parse the transcript' }, { status: 500 });
  }
}
