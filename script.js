const btnEscuchar = document.getElementById('btn-escuchar');
const status = document.getElementById('status');
const rostro = document.getElementById('rostro');

// 1. Configuración de la Voz (Oído)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-MX'; // Idioma español de México
recognition.interimResults = false;

// 2. Configuración de la Voz (Hablar)
const synth = window.speechSynthesis;

// Función para que la IA hable
function hablar(texto) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    
    // Animación: Abrir la boca mientras habla
    utterance.onstart = () => { rostro.innerText = "😮"; };
    utterance.onend = () => { rostro.innerText = "😊"; };
    
    synth.speak(utterance);
}

// 3. Lógica al presionar el botón
btnEscuchar.addEventListener('click', () => {
    recognition.start();
    status.innerText = "Escuchando...";
    rostro.innerText = "👂";
});

// Cuando el navegador termina de escuchar
recognition.onresult = async (event) => {
    const textoEscuchado = event.results[0][0].transcript;
    status.innerText = "Dijiste: " + textoEscuchado;
    
    // Enviamos lo que escuchamos a Gemini
    const respuestaIA = await preguntarAGemini(textoEscuchado);
    
    // Hacemos que la IA hable la respuesta
    hablar(respuestaIA);
};

// Función de conexión con Gemini (la que ya tenías)
async function preguntarAGemini(textoUsuario) {
    status.innerText = "Pensando...";
    rostro.innerText = "🤔";

    try {
        const respuesta = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textoUsuario })
        });

        const datos = await respuesta.json();
        return datos.reply;

    } catch (error) {
        status.innerText = "Error de conexión.";
        rostro.innerText = "😵";
        return "Lo siento, tuve un problema al conectar con mi cerebro digital.";
    }
}
