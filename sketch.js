// Teachable Machine - Detector de Patrones de Velas
let modelURL = 'https://teachablemachine.withgoogle.com/models/sva6lJ8Qv/';

// Variables globales
let classifier;
let video;
let label = "Esperando...";
let confidence = 0;
let videoAspectRatio = 9/16;
let modelLoaded = false;
let videoLoaded = false;
let classificationStarted = false;

// Elementos DOM
let statusDiv;
let loadingDiv;

function setup() {
  // Configurar elementos DOM
  statusDiv = select('#status');
  loadingDiv = select('#loading');
  
  // Crear canvas
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('container');
  
  updateStatus('Configurando cámara...');
  
  // Configurar la cámara trasera
  let constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  };
  
  try {
    video = createCapture(constraints, function(stream) {
      updateStatus('Cámara iniciada');
      videoLoaded = true;
      video.hide();
      tryStartClassification();
    });
    
    video.on('error', function(err) {
      updateStatus('Error en cámara: ' + err);
      console.error('Error de cámara:', err);
    });
  } catch (error) {
    updateStatus('Error al acceder a cámara');
    console.error('Error al crear captura:', error);
  }
  
  updateStatus('Cargando modelo...');
  
  // Cargar el modelo
  classifier = ml5.imageClassifier(modelURL + 'model.json', function() {
    updateStatus('Modelo cargado');
    modelLoaded = true;
    tryStartClassification();
  });
  
  classifier.on('error', function(error) {
    updateStatus('Error en modelo: ' + error);
    console.error('Error en modelo:', error);
  });
}

function tryStartClassification() {
  if (modelLoaded && videoLoaded && !classificationStarted) {
    updateStatus('Clasificando...');
    classificationStarted = true;
    classifyVideo();
    // Ocultar loading después de un tiempo
    setTimeout(() => {
      if (loadingDiv) loadingDiv.hide();
    }, 2000);
  }
}

function classifyVideo() {
  if (classifier && video) {
    classifier.classify(video, gotResults);
  } else {
    setTimeout(classifyVideo, 1000);
  }
}

function gotResults(error, results) {
  if (error) {
    updateStatus('Error: ' + error);
    console.error(error);
    setTimeout(classifyVideo, 1000);
    return;
  }
  
  if (results && results[0]) {
    label = results[0].label;
    confidence = results[0].confidence;
    updateStatus('Clasificado: ' + label);
  }
  
  classifyVideo();
}

function updateStatus(message) {
  if (statusDiv) {
    statusDiv.html('Estado: ' + message);
  }
  console.log(message);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  if (video) {
    // Calcular dimensiones para mantener relación de aspecto
    let aspectRatio = video.width / video.height;
    let displayWidth = width;
    let displayHeight = width / aspectRatio;
    
    if (displayHeight > height) {
      displayHeight = height;
      displayWidth = height * aspectRatio;
    }
    
    let x = (width - displayWidth) / 2;
    let y = (height - displayHeight) / 2;
    
    image(video, x, y, displayWidth, displayHeight);
  }
  
  // Dibujar overlay de información
  fill(0, 0, 0, 180);
  rect(0, height - 60, width, 60);
  
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(`${label} (${nf(confidence * 100, 2, 1)}%)`, width / 2, height - 35);
  
  // Indicador de cámara trasera
  fill(255, 0, 0);
  ellipse(30, 30, 10, 10);
  fill(255);
  textSize(12);
  text("Cámara trasera", 30, 50);
}
