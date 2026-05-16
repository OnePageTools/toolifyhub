
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

/**
 * @fileOverview API Route to fetch and parse YouTube transcripts using RapidAPI.
 * This route communicates with the YouTube Transcriptor API to retrieve structured caption data.
 */

export async function GET(request: NextRequest) {
  // Apply Rate Limiting
  if (!rateLimit(request, 10, 60000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute.' },
      { status: 429 }
    );
  }

  const videoId = request.nextUrl.searchParams.get('videoId');

  if (!videoId || videoId.length !== 11) {
    return NextResponse.json({ error: 'Valid Video ID is required' }, { status: 400 });
  }

  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key configuration missing' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}&lang=en`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com',
          'x-rapidapi-key': apiKey
        }
      }
    );

    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to communicate with the transcript service.' }, { status: response.status });
    }

    const data = await response.json();

    if (!data || data.error || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json(
        { error: 'No transcript found for this video. It might be private or have captions disabled.' },
        { status: 404 }
      );
    }

    // Parse transcript data from various potential response formats
    let lines = [];

    if (Array.isArray(data)) {
      lines = data.map((item) => ({
        start: item.start || 0,
        text: item.text || item.transcript || ''
      }));
    } else if (data.transcript) {
      lines = data.transcript.map((item: any) => ({
        start: item.start || 0,
        text: item.text || ''
      }));
    } else if (data.transcription) {
      lines = data.transcription.map((item: any) => ({
        start: (item.offset / 1000) || 0,
        text: item.text || ''
      }));
    }

    if (lines.length === 0) {
      return NextResponse.json(
        { error: 'The transcript content was empty or unreadable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transcript: lines,
      videoId: videoId,
    });
  } catch (error: any) {
    console.error('Transcript API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching the transcript' }, { status: 500 });
  }
}
