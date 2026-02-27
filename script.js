const btnEscuchar = document.getElementById('btn-escuchar');
const status = document.getElementById('status');
const rostro = document.getElementById('rostro');

// CONFIGURACIÓN DE VOZ (Oído)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-MX';
recognition.interimResults = false;

// CONFIGURACIÓN DE VOZ (Hablar)
const synth = window.speechSynthesis;

function hablar(texto) {
    synth.cancel(); // Detener cualquier audio previo
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    
    utterance.onstart = () => { rostro.innerText = "😮"; };
    utterance.onend = () => { rostro.innerText = "😊"; };
    
    synth.speak(utterance);
}

// ACTIVAR MICRÓFONO
btnEscuchar.addEventListener('click', () => {
    try {
        recognition.start();
        status.innerText = "Escuchando...";
        rostro.innerText = "👂";
    } catch (e) {
        console.log("El micrófono ya está activo.");
    }
});

// PROCESAR RESULTADO
recognition.onresult = async (event) => {
    const textoEscuchado = event.results[0][0].transcript;
    status.innerText = "Dijiste: " + textoEscuchado;
    
    const respuestaIA = await preguntarAGemini(textoEscuchado);
    hablar(respuestaIA);
};

// LLAMADA AL SERVIDOR
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
        return datos.reply || "No recibí una respuesta válida.";

    } catch (error) {
        console.error("Error de conexión:", error);
        status.innerText = "Error de red.";
        rostro.innerText = "😵";
        return "Hubo un fallo en la conexión con mi servidor.";
    }
}
