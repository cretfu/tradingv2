// Teachable Machine
// https://editor.p5js.org/

// Variable para el video
let video;
// Variable para guardar el label
let label = "Esperando...";
// El clasificador
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/MI_MODELO/'; // Reemplaza con la URL de tu modelo

// Paso 1: Cargar el modelo
function preload() {
    classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
    createCanvas(640, 520);
    // Crear el video con la cámara trasera
    let constraints = {
        video: {
            facingMode: { exact: "environment" } // Usar la cámara trasera
        }
    };
    video = createCapture(constraints);
    video.hide();
    // Paso 2: Empezar la clasificación
    classifyVideo();
}

// Paso 2: Clasificar el video
function classifyVideo() {
    classifier.classify(video, gotResults);
}

function draw() {
    background(0);
    // Dibujar el video
    image(video, 0, 0);
    // Dibujar el label
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255);
    text(label, width / 2, height - 16);
    // Elegir emoji y mensaje según la label
    let emoji = "🔴";
    let mensaje = "";
    if (label == "Compra") {
        emoji = "✅";
        mensaje = "Señal de COMPRA";
    } else if (label == "Venta") {
        emoji = "🟥";
        mensaje = "Señal de VENTA";
    }
    // Dibujar el emoji
    textSize(256);
    text(emoji, width / 2, height / 2);
    textSize(32);
    text(mensaje, width / 2, height / 1.2);
}

// Paso 3: Obtener los resultados de la clasificación
function gotResults(error, results) {
    // Si hay un error, mostrarlo en consola
    if (error) {
        console.error(error);
        return;
    }
    // Guardar el label y volver a clasificar
    label = results[0].label;
    classifyVideo();
}

