// Teachable Machine - Detector de Patrones de Velas
// URL de tu modelo (¡reemplaza con la URL de tu modelo de Teachable Machine!)
let modelURL = 'https://teachablemachine.withgoogle.com/models/sva6lJ8Qv/';

// Variables globales
let classifier;
let video;
let label = "Esperando...";
let confidence = 0;

// Precargar el modelo
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

// Configuración inicial
function setup() {
  createCanvas(640, 520);
  
  // Configurar la cámara trasera (facingMode: 'environment')
  let constraints = {
    video: {
      facingMode: 'environment' // Usa la cámara trasera
    }
  };
  
  // Crear la captura de video con las restricciones
  video = createCapture(constraints);
  video.hide();
  
  // Iniciar la clasificación
  classifyVideo();
}

// Función para clasificar el video
function classifyVideo() {
  if (classifier && video) {
    classifier.classify(video, gotResults);
  } else {
    console.error("Classifier o video no están listos.");
  }
}

// Función para manejar los resultados
function gotResults(error, results) {
  if (error) {
    console.error(error);
    label = "Error";
    return;
  }
  
  // Mostrar resultados en consola
  console.log(results);
  
  // Actualizar label y confianza
  label = results[0].label;
  confidence = results[0].confidence;
  
  // Clasificar nuevamente
  classifyVideo();
}

// Dibujar en el canvas
function draw() {
  background(0);
  
  // Dibujar el video
  image(video, 0, 0, width, height);
  
  // Dibujar el label y confianza
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(label + " (" + nf(confidence * 100, 2, 1) + "%)", width / 2, height - 20);
}


