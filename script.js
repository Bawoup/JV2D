const video = document.getElementById('video');

const defaultParams = {
  flipHorizontal: false,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 20,
  iouThreshold: 0.2,
  scoreThreshold: 0.9,
  modelType: "ssd320fpnlite",
  modelSize: "large",
  bboxLineWidth: "2",
  fontSize: 17,
};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(handTrack.startVideo())

handTrack.startVideo(video).then(status => {
    if(status){
      navigator.getUserMedia(
        { video: {} },
        stream => {
          video.srcObject = stream;
          setInterval(detectHand, 2000)},
        err => console.error(err)
      )
    }
  
});

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
})

async function detectHand() {
  const video = document.getElementById('video');
  const model = await handTrack.load()
  const predictions = await model.detect(video);
  if (predictions.length > 1) {
    if (predictions[0].label == "face" && predictions[1].score > 0.9) {
      console.log(predictions[1].label)
    } else if (predictions[0].label != "face"){
      console.log(predictions[0].label)
    } else {console.log(predictions)
    }} else {console.log(predictions)};
};

//Fonction de detection des emotions
async function detectEmotion() {
    const video = document.getElementById('video');
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

    if (detections.length > 0) {
        const expression = detections[0].expressions;
        let emotion = 'neutral';
        let maxValue = 0;
    
        Object.keys(expression).forEach((key) => {
          if (expression[key] > maxValue) {
            maxValue = expression[key];
            emotion = key;
          }
        });
    
    document.getElementById('resultat').innerHTML = emotion;
    }
};
