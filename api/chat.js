export default async function handler(request, response) {
  // Solo permitimos peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = request.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Validación de seguridad: Si falta la llave, avisamos de inmediato
    if (!apiKey) {
      return response.status(500).json({ reply: "Error: No se encontró la API Key en la configuración de Vercel." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Estructura optimizada para Gemini 1.5 Flash
    const payload = {
      contents: [{
        parts: [{ 
          text: `Instrucción de sistema: Eres el coordinador de la carrera de IA en la Universidad Iberoamericana. Eres innovador, amable y experto. Pregunta del usuario: ${prompt}` 
        }]
      }]
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();

    // Verificamos si la respuesta de Google tiene el formato esperado
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const textoRespuesta = data.candidates[0].content.parts[0].text;
      return response.status(200).json({ reply: textoRespuesta });
    } else {
      console.error("Respuesta fallida de Gemini:", data);
      return response.status(500).json({ reply: "Gemini no pudo procesar la respuesta. Revisa el formato del prompt." });
    }

  } catch (error) {
    console.error("Error en el servidor local:", error);
    return response.status(500).json({ reply: "Hubo un error interno en el servidor (api/chat.js)." });
  }
}
