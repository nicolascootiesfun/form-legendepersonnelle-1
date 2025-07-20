import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, formData } = await request.json();

    if (!sessionId || !formData) {
      return NextResponse.json(
        { error: 'Session ID and form data are required' },
        { status: 400 }
      );
    }

    // Trigger N8N webhook for story generation
    const n8nWebhookUrl = process.env.N8N_STORY_GENERATION_WEBHOOK;
    if (!n8nWebhookUrl) {
      console.error('N8N_STORY_GENERATION_WEBHOOK not configured');
      return NextResponse.json(
        { error: 'Story generation service not configured' },
        { status: 500 }
      );
    }

    // Prepare character data with uploaded image URLs
    const characterData = Object.entries(formData.characterDetails || {}).map(
      ([character, details]: [string, any]) => ({
        type: character,
        name: details.name,
        description: details.description,
        // Note: Photo URLs would need to be uploaded to WordPress first
        photoUrl: details.photo ? null : null, // Placeholder for uploaded URL
      })
    );

    // Send request to N8N
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        childData: {
          firstName: formData.childFirstName,
          age: formData.childAge,
          personalityTraits: formData.personalityTraits,
          otherPersonalityTrait: formData.otherPersonalityTrait,
          additionalCharacteristics: formData.additionalCharacteristics,
          physicalDescription: formData.physicalDescription,
          heroImageUrl: formData.generatedHeroImageUrl,
        },
        characters: characterData,
        storyPreferences: {
          style: formData.storyStyle,
          theme: formData.theme,
          problem: formData.problem || formData.customProblem,
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phoneNumber,
        },
      }),
    });

    if (!n8nResponse.ok) {
      console.error('N8N webhook error:', await n8nResponse.text());
      return NextResponse.json(
        { error: 'Failed to trigger story generation' },
        { status: 500 }
      );
    }

    const result = await n8nResponse.json();

    return NextResponse.json({ 
      success: true,
      storyId: result.storyId || null,
    });
  } catch (error) {
    console.error('Error in generate-story API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
