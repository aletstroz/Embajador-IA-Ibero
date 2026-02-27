export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = request.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(200).json({ reply: "Error: No configuraste la clave API en Vercel." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{ text: `Actúa como el coordinador de la carrera de IA de la Ibero. Responde de forma breve a lo siguiente: ${prompt}` }]
      }],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();

    // Verificamos si hay respuesta de texto o si fue bloqueada
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const textoRespuesta = data.candidates[0].content.parts[0].text;
      return response.status(200).json({ reply: textoRespuesta });
    } else {
      // Si no hay texto, enviamos el motivo del error técnico para depurar
      console.error("Respuesta vacía de Google:", JSON.stringify(data));
      return response.status(200).json({ reply: "Google no devolvió texto. Verifica que tu API Key no tenga restricciones de facturación o región." });
    }

  } catch (error) {
    console.error("Error en el servidor:", error);
    return response.status(200).json({ reply: "Error interno en el servidor de Vercel al procesar la solicitud." });
  }
}
