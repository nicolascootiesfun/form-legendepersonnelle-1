import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, formData } = await request.json();

    if (!sessionId || !formData) {
      return NextResponse.json(
        { error: 'Session ID and form data are required' },
        { status: 400 }
      );
    }

    // Create a pending image record in Supabase
    const { data: imageRecord, error: dbError } = await supabase
      .from('generated_images')
      .insert({
        user_session_id: sessionId,
        image_type: 'hero',
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create image record' },
        { status: 500 }
      );
    }

    // Trigger N8N webhook for image generation
    const n8nWebhookUrl = process.env.N8N_IMAGE_GENERATION_WEBHOOK;
    if (!n8nWebhookUrl) {
      console.error('N8N_IMAGE_GENERATION_WEBHOOK not configured');
      
      // Update status to error
      await supabase
        .from('generated_images')
        .update({ status: 'error' })
        .eq('id', imageRecord.id);

      return NextResponse.json(
        { error: 'Image generation service not configured' },
        { status: 500 }
      );
    }

    // Send request to N8N
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageRecordId: imageRecord.id,
        sessionId,
        childData: {
          name: formData.childFirstName,
          age: formData.childAge,
          personalityTraits: formData.personalityTraits,
          physicalDescription: formData.physicalDescription,
          additionalCharacteristics: formData.additionalCharacteristics,
        },
      }),
    });

    if (!n8nResponse.ok) {
      console.error('N8N webhook error:', await n8nResponse.text());
      
      // Update status to error
      await supabase
        .from('generated_images')
        .update({ status: 'error' })
        .eq('id', imageRecord.id);

      return NextResponse.json(
        { error: 'Failed to trigger image generation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      imageRecordId: imageRecord.id,
    });
  } catch (error) {
    console.error('Error in generate-image API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
