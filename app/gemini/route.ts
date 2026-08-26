import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json();
    const activeKey = apiKey || process.env.GEMINI_API_KEY;

    if (!activeKey) {
      return NextResponse.json(
        { error: 'Gemini API key is required. Please enter your key in the dashboard.' },
        { status: 401 }
      );
    }

    const startTime = performance.now();

    // Call Gemini 2.5 Flash / 2.0 Flash endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const durationMs = Math.round(performance.now() - startTime);

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    const textOutput =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({
      success: true,
      text: textOutput,
      durationMs,
      model: 'gemini-2.5-flash',
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process Gemini inference', details: (err as Error).message },
      { status: 500 }
    );
  }
}