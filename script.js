const btnEscuchar = document.getElementById('btn-escuchar');
const status = document.getElementById('status');
const rostro = document.getElementById('rostro');

// CONFIGURACIÓN DE VOZ (Reconocimiento)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-MX';
recognition.interimResults = false;

// CONFIGURACIÓN DE VOZ (Salida/Habla)
const synth = window.speechSynthesis;

function hablar(texto) {
    // Cancelamos cualquier audio previo para evitar que se encimen
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    
    // Animación básica del rostro al hablar
    utterance.onstart = () => { rostro.innerText = "😮"; };
    utterance.onend = () => { rostro.innerText = "😊"; };
    
    synth.speak(utterance);
}

// LÓGICA DEL BOTÓN
btnEscuchar.addEventListener('click', () => {
    try {
        recognition.start();
        status.innerText = "Te escucho...";
        rostro.innerText = "👂";
    } catch (e) {
        console.log("El reconocimiento ya estaba activo.");
    }
});

// PROCESAMIENTO AL TERMINAR DE ESCUCHAR
recognition.onresult = async (event) => {
    const textoEscuchado = event.results[0][0].transcript;
    status.innerText = "Dijiste: " + textoEscuchado;
    
    // Llamada a la IA
    const respuestaIA = await preguntarAGemini(textoEscuchado);
    
    // Hablar la respuesta
    hablar(respuestaIA);
};

// FUNCIÓN DE CONEXIÓN CON TU SERVIDOR (API)
async function preguntarAGemini(textoUsuario) {
    status.innerText = "Pensando...";
    rostro.innerText = "🤔";

    try {
        const respuesta = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textoUsuario })
        });

        if (!respuesta.ok) {
            throw new Error('Error en el servidor');
        }

        const datos = await respuesta.json();
        return datos.reply;

    } catch (error) {
        console.error("Error detallado:", error);
        status.innerText = "Error de conexión.";
        rostro.innerText = "😵";
        return "Lo siento, parece que mi conexión al servidor falló.";
    }
}
