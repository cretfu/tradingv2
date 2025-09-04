// Teachable Machine - Detector de Patrones de Velas
// URL de tu modelo (¡reemplaza con la URL de tu modelo de Teachable Machine!)
let modelURL = 'https://teachablemachine.withgoogle.com/models/sva6lJ8Qv/';

// Variables globales
let classifier;
let video;
let label = "Esperando...";
let confidence = 0;

// Tamaño del canvas (modo vertical)
let canvasWidth = 360;
let canvasHeight = 640;

// Variables para ajustar la relación de aspecto del video
let videoWidth, videoHeight;
let videoAspectRatio, canvasAspectRatio;
let x, y, drawWidth, drawHeight;

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
      facingMode: 'environment'
      // No forzar resolución, dejar que la cámara elija la relación de aspecto nativa
    }
  };
  
  // Crear la captura de video con las restricciones
  video = createCapture(constraints);
  video.hide();
  
  // Esperar a que el video cargue para obtener sus dimensiones
  video.on('loadedmetadata', () => {
    videoWidth = video.width;
    videoHeight = video.height;
    videoAspectRatio = videoWidth / videoHeight;
    canvasAspectRatio = canvasWidth / canvasHeight;
    
    // Calcular dimensiones para dibujar el video manteniendo la relación de aspecto
    if (videoAspectRatio > canvasAspectRatio) {
      // El video es más ancho que el canvas
      drawWidth = canvasWidth;
      drawHeight = drawWidth / videoAspectRatio;
      x = 0;
      y = (canvasHeight - drawHeight) / 2;
    } else {
      // El video es más alto que el canvas
      drawHeight = canvasHeight;
      drawWidth = drawHeight * videoAspectRatio;
      x = (canvasWidth - drawWidth) / 2;
      y = 0;
    }
  });
  
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
  background(0); // Fondo negro
  
  // Dibujar el video manteniendo la relación de aspecto
  if (video) {
    image(video, x, y, drawWidth, drawHeight);
  }
  
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
