export default async function handler(request, response) {
  try {
    const { prompt } = request.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(200).json({ reply: "Falta la clave API en Vercel." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Estructura mínima requerida por Google
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return response.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return response.status(200).json({ reply: "Google respondió pero sin texto. Verifica tu cuota de API." });
    }

  } catch (error) {
    return response.status(200).json({ reply: "Error interno en el servidor de Vercel." });
  }
}
