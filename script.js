async function preguntarAGemini(textoUsuario) {
    const status = document.getElementById('status');
    status.innerText = "Pensando...";

    // Llamamos a nuestro "mensajero" que creamos en el paso 2
    const respuesta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textoUsuario })
    });

    const datos = await respuesta.json();
    
    // Aquí es donde la IA te responde
    console.log("Gemini dice:", datos.reply);
    status.innerText = "Listo.";
    return datos.reply;
}
