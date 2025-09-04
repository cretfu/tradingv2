// Teachable Machine - Detector de Patrones de Velas
let modelURL = 'https://teachablemachine.withgoogle.com/models/sva6lJ8Qv/';

// Variables globales
let classifier;
let video;
let label = "Cargando modelo...";
let confidence = 0;
let videoAspectRatio = 9/16; // Valor inicial

// Precargar el modelo
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json', () => {
    console.log("✅ Modelo cargado correctamente");
    label = "Modelo listo";
  });
}

// Configuración inicial
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('container');
  
  let constraints = {
    video: {
      facingMode: 'environment'
    }
  };
  
  // Crear la captura de video
  video = createCapture(constraints, () => {
    console.log("📷 Cámara iniciada");
  });
  video.hide();
  
  // Esperar a que el video cargue
  video.on('loadedmetadata', function() {
    videoAspectRatio = video.width / video.height;
    console.log("📐 Relación de aspecto: " + videoAspectRatio);
    resizeCanvas(windowWidth, windowWidth / videoAspectRatio);
    
    // Iniciar clasificación
    classifyVideo();
  });
}

// Clasificar video
function classifyVideo() {
  if (classifier && video) {
    classifier.classify(video, gotResults);
  } else {
    console.warn("⏳ Esperando modelo o video...");
    setTimeout(classifyVideo, 1000);
  }
}

// Resultados
function gotResults(error, results) {
  if (error) {
    console.error("❌ Error en clasificación:", error);
    label = "Error";
    setTimeout(classifyVideo, 1000);
    return;
  }
  
  console.log("📊 Resultados:", results);
  label = results[0].label;
  confidence = results[0].confidence;
  
  classifyVideo();
}

// Ajuste al redimensionar
function windowResized() {
  resizeCanvas(windowWidth, windowWidth / videoAspectRatio);
}

// Dibujar en canvas
function draw() {
  background(0);
  
  // Mantener proporción del video
  let scale = Math.min(width / video.width, height / video.height);
  let scaledWidth = video.width * scale;
  let scaledHeight = video.height * scale;
  let x = (width - scaledWidth) / 2;
  let y = (height - scaledHeight) / 2;
  
  image(video, x, y, scaledWidth, scaledHeight);
  
  // Overlay para texto
  fill(0, 0, 0, 180);
  rect(0, height - 60, width, 60);
  
  // Label + confianza
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(`${label} (${nf(confidence * 100, 2, 1)}%)`, width / 2, height - 35);
  
  // Indicador de cámara
  fill(255, 0, 0);
  ellipse(width - 20, 20, 10, 10);
  fill(255);
  textSize(12);
  text("Cámara trasera", width - 20, 40);
}
