export default async function handler(request, response) {
  // 1. Extraemos lo que el usuario escribió
  const { prompt } = request.body;

  // 2. Aquí es donde llamamos a Gemini usando tu clave secreta (que guardaremos en Vercel)
  const apiKey = process.env.GEMINI_API_KEY; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    system_instruction: {
      parts: [{ text: "Eres el coordinador de la carrera de IA en la Ibero. Eres amable, innovador y experto en tecnología." }]
    }
  };

  try {
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();
    // 3. Devolvemos solo el texto de la respuesta a tu página web
    const textoRespuesta = data.candidates[0].content.parts[0].text;
    response.status(200).json({ reply: textoRespuesta });

  } catch (error) {
    response.status(500).json({ error: "Error al conectar con Gemini" });
  }
}
