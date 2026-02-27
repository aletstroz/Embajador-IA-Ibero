const btnEscuchar = document.getElementById('btn-escuchar');
const status = document.getElementById('status');
const rostro = document.getElementById('rostro');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-MX';

const synth = window.speechSynthesis;

function hablar(texto) {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    utterance.onstart = () => { rostro.innerText = "😮"; };
    utterance.onend = () => { rostro.innerText = "😊"; };
    synth.speak(utterance);
}

btnEscuchar.addEventListener('click', () => {
    try {
        recognition.start();
        status.innerText = "Escuchando...";
        rostro.innerText = "👂";
    } catch (e) { console.log("Reconocimiento ya activo"); }
});

recognition.onresult = async (event) => {
    const textoEscuchado = event.results[0][0].transcript;
    status.innerText = "Dijiste: " + textoEscuchado;
    
    const respuestaIA = await preguntarAGemini(textoEscuchado);
    hablar(respuestaIA);
};

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
        return datos.reply || "No recibí respuesta.";

    } catch (error) {
        status.innerText = "Error de conexión.";
        rostro.innerText = "😵";
        return "Mi conexión falló. Por favor, revisa los logs en el panel de Vercel.";
    }
}
