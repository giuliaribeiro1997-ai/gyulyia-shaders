// api/generate-shader.js
// Vercel Serverless Function — proxy seguro para a API da Anthropic
// A chave de API fica SOMENTE no servidor, nunca exposta ao browser.

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Lê a chave da variável de ambiente do Vercel
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return res.status(400).json({ error: 'Prompt inválido.' });
    }

    const systemPrompt = `Você é especialista em GLSL WebGL 1.0. Retorne SOMENTE o código GLSL do fragment shader, sem markdown, sem explicações, sem blocos de código.

REGRAS OBRIGATÓRIAS:
1. Comece com: precision mediump float;
2. NÃO declare estes uniforms (já existem no engine):
   uTime, uBass, uMid, uTreble, uVol, uInt, uSpd, uZoom, uRot, uBM, uMM, uTM, uRes, uTint, uTintStr, uMix, uTex, uHasTex
3. Use gl_FragColor para definir a cor do pixel
4. Use gl_FragCoord para obter a posição do pixel
5. Audioretividade: use uBass*uBM, uMid*uMM, uTreble*uTM
6. Se uHasTex==1, misture texture2D(uTex, uv) com uMix
7. Aplique tint: mix(cor, cor*uTint, uTintStr)
8. Apenas GLSL 1.0 (WebGL 1.0) — sem textureSize, in/out, layout
9. Retorne SOMENTE o código GLSL puro, nada mais`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Crie um fragment shader GLSL audioreativo para: ${prompt}` }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'Erro na API Anthropic' });
    }

    const data = await response.json();
    const shaderCode = data.content
      .map(c => c.text || '')
      .join('')
      .replace(/```glsl|```frag|```/g, '')
      .trim();

    return res.status(200).json({ shader: shaderCode });

  } catch (err) {
    console.error('Erro no proxy:', err);
    return res.status(500).json({ error: 'Erro interno do servidor: ' + err.message });
  }
}
