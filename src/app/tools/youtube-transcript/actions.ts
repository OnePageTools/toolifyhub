'use server';

/**
 * @fileOverview Server action to fetch YouTube transcript data using external APIs.
 * This bypasses CORS and extraction issues.
 */

export async function getYouTubeTranscriptAction(videoId: string) {
  try {
    // API 1: Kome.ai (Primary)
    const response1 = await fetch(
      `https://api.kome.ai/api/tools/youtube-transcripts?video_id=${videoId}&format=true`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response1.ok) {
      const data1 = await response1.json();
      if (data1 && data1.transcript && data1.transcript.length > 0) {
        return {
          success: true,
          transcript: data1.transcript.map((item: any) => ({
            start: item.start || 0,
            text: item.text || '',
          })),
        };
      }
    }

    // API 2: Backup (Vercel hosted helper)
    const response2 = await fetch(`https://yt-transcript-api.vercel.app/transcript?video_id=${videoId}`);
    if (response2.ok) {
      const data2 = await response2.json();
      // Handle both { transcript: [] } and plain array formats
      const list = Array.isArray(data2) ? data2 : data2.transcript;
      if (list && list.length > 0) {
        return {
          success: true,
          transcript: list.map((item: any) => ({
            start: item.start || item.offset / 1000 || 0,
            text: item.text || item.content || '',
          })),
        };
      }
    }

    throw new Error('This video has no captions. Try another video.');
  } catch (error: any) {
    console.error('Transcript API Error:', error.message);
    
    // Customize error message for common failures
    let msg = 'Could not fetch transcript. Please try again.';
    if (error.message.includes('private')) msg = 'This video is private.';
    if (error.message.includes('captions')) msg = 'This video has no captions. Try another video.';
    
    return {
      success: false,
      error: msg,
    };
  }
}
