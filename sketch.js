// Teachable Machine - Detector de Patrones de Velas
// URL de tu modelo (¡reemplaza con la URL de tu modelo de Teachable Machine!)
let modelURL = 'https://teachablemachine.withgoogle.com/models/sva6lJ8Qv/';

// Variables globales
let classifier;
let video;
let label = "Esperando...";
let confidence = 0;

// Tamaño vertical 9:16 (ajustable)
let canvasWidth = 360;  // Ancho para modo vertical
let canvasHeight = 640; // Alto para modo vertical

// Precargar el modelo
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

// Configuración inicial
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  // Configurar la cámara trasera (facingMode: 'environment')
  let constraints = {
    video: {
      facingMode: 'environment',
      width: canvasWidth,
      height: canvasHeight
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
    // Reintentar después de 1 segundo
    setTimeout(classifyVideo, 1000);
  }
}

// Función para manejar los resultados
function gotResults(error, results) {
  if (error) {
    console.error(error);
    label = "Error";
    // Reintentar después de 1 segundo
    setTimeout(classifyVideo, 1000);
    return;
  }
  
  // Actualizar label y confianza
  label = results[0].label;
  confidence = results[0].confidence;
  
  // Clasificar nuevamente
  classifyVideo();
}

// Dibujar en el canvas
function draw() {
  // Dibujar el video ajustado al canvas
  image(video, 0, 0, width, height);
  
  // Dibujar overlay semitransparente para mejor legibilidad
  fill(0, 0, 0, 180);
  rect(0, height - 60, width, 60);
  
  // Dibujar el label y confianza
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(`${label} (${nf(confidence * 100, 2, 1)}%)`, width / 2, height - 35);
  
  // Dibujar indicador de cámara trasera
  fill(255, 0, 0);
  ellipse(width - 20, 20, 10, 10);
  fill(255);
  textSize(12);
  text("Cámara trasera", width - 20, 40);
}
