// Teachable Machine - Detector de Patrones de Velas
// URL de tu modelo (¡reemplaza con la URL de tu modelo de Teachable Machine!)
let modelURL = 'https://teachablemachine.withgoogle.com/models/sva6lJ8Qv/';

// Variables globales
let classifier;
let video;
let label = "Esperando...";
let confidence = 0;
let videoAspectRatio = 9/16; // Inicialmente 9:16

// Precargar el modelo
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

// Configuración inicial
function setup() {
  // Usar toda la ventana
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('container');
  
  // Configurar la cámara trasera
  let constraints = {
    video: {
      facingMode: 'environment'
      // Dejamos que la cámara determine su resolución nativa
    }
  };
  
  // Crear la captura de video
  video = createCapture(constraints);
  video.hide();
  
  // Esperar a que el video cargue para obtener su relación de aspecto real
  video.on('loadedmetadata', function() {
    // Calcular la relación de aspecto real del video
    videoAspectRatio = video.width / video.height;
    console.log("Relación de aspecto de la cámara: " + videoAspectRatio);
    
    // Redimensionar el canvas para que coincida con la relación de aspecto del video
    resizeCanvas(windowWidth, windowWidth / videoAspectRatio);
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
    setTimeout(classifyVideo, 1000);
  }
}

// Función para manejar los resultados
function gotResults(error, results) {
  if (error) {
    console.error(error);
    label = "Error";
    setTimeout(classifyVideo, 1000);
    return;
  }
  
  label = results[0].label;
  confidence = results[0].confidence;
  
  classifyVideo();
}

// Ajustar el canvas cuando cambia el tamaño de la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowWidth / videoAspectRatio);
}

// Dibujar en el canvas
function draw() {
  background(0);
  
  // Dibujar el video manteniendo su relación de aspecto original
  let scale = Math.min(width / video.width, height / video.height);
  let scaledWidth = video.width * scale;
  let scaledHeight = video.height * scale;
  let x = (width - scaledWidth) / 2;
  let y = (height - scaledHeight) / 2;
  
  image(video, x, y, scaledWidth, scaledHeight);
  
  // Dibujar overlay semitransparente
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
