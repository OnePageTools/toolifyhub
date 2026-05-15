'use server';

/**
 * @fileOverview Server action to fetch YouTube transcript data.
 * This bypasses CORS issues when fetching YouTube pages from the browser.
 */

export async function getYouTubeTranscriptAction(videoId: string) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Could not reach YouTube.');
    }

    const html = await response.text();
    
    // Extract the ytInitialPlayerResponse JSON
    const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
    if (!match) {
      // Check if video is private or unavailable
      if (html.includes('class="ytp-error-content"')) {
        throw new Error('This video is private or unavailable.');
      }
      throw new Error('Could not extract video data from YouTube.');
    }

    const playerResponse = JSON.parse(match[1]);
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
      throw new Error("This video doesn't have captions available. Try a video with CC enabled.");
    }

    return {
      success: true,
      tracks: captionTracks.map((track: any) => ({
        baseUrl: track.baseUrl,
        name: track.name.simpleText || track.name.runs?.[0]?.text || 'English',
        languageCode: track.languageCode,
        isTranslatable: track.isTranslatable,
      })),
    };
  } catch (error: any) {
    console.error('Transcript Error:', error.message);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.',
    };
  }
}
