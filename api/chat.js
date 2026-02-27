export default async function handler(request, response) {
  // Verificamos que sea un método POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = request.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(500).json({ reply: "Error: No configuraste la API Key en Vercel." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Estructura simplificada para asegurar compatibilidad
    const payload = {
      contents: [{
        parts: [{ text: `Instrucción: Actúa como el coordinador de IA de la Ibero. Pregunta del usuario: ${prompt}` }]
      }]
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const textoRespuesta = data.candidates[0].content.parts[0].text;
      return response.status(200).json({ reply: textoRespuesta });
    } else {
      // Si Gemini responde algo raro, lo capturamos aquí
      return response.status(500).json({ reply: "Gemini recibió el mensaje pero no pudo generar una respuesta clara." });
    }

  } catch (error) {
    // Si el servidor falla, enviamos un mensaje de texto para que la página no se quede "Pensando"
    return response.status(500).json({ reply: "Tuve un error interno en mi servidor. Revisa los logs de Vercel." });
  }
}
