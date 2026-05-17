
import { NextRequest, NextResponse } from 'next/server';

/**
 * @fileOverview API Route to proxy background removal requests to remove.bg.
 * This prevents CSP blocks and hides the API key from the client.
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Prepare data for the remove.bg API
    const apiFormData = new FormData();
    apiFormData.append('image_file', imageFile);
    apiFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'bSZNM4rs3qcZEogPk4ctdm41',
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.errors?.[0]?.title || 'Failed to remove background';
      
      // Handle specific error cases for better user feedback
      if (response.status === 429) {
          return NextResponse.json({ error: 'Free limit reached. Try again tomorrow.' }, { status: 429 });
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"'
      }
    });

  } catch (error) {
    console.error('Remove.bg Proxy Error:', error);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
