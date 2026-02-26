// Seleccionamos los elementos de nuestra página
const btnEscuchar = document.getElementById('btn-escuchar');
const status = document.getElementById('status');
const rostro = document.getElementById('rostro');

// Esta función envía el texto a nuestro "mensajero" (la función serverless)
async function preguntarAGemini(textoUsuario) {
    status.innerText = "Pensando...";
    rostro.innerText = "🤔"; // Cambia el emoji mientras piensa

    try {
        const respuesta = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textoUsuario })
        });

        const datos = await respuesta.json();
        
        status.innerText = "Gemini respondió.";
        rostro.innerText = "😊"; // Vuelve a estar feliz
        
        console.log("Respuesta de la IA:", datos.reply);
        alert("La IA dice: " + datos.reply); // Una alerta simple para probar

    } catch (error) {
        console.error("Error:", error);
        status.innerText = "Error al conectar.";
        rostro.innerText = "😵";
    }
}

// Probamos con un clic (antes de configurar la voz)
btnEscuchar.addEventListener('click', () => {
    const preguntaMock = "Hola, ¿de qué trata la carrera de IA?";
    preguntarAGemini(preguntaMock);
});
