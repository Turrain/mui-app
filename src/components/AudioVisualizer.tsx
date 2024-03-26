import React, { useEffect, useRef } from 'react';

export type AudioVisualizerProps = {
    audiostr: string 
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({audiostr}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
  
    const source = setupAudioSource(audioContext); // Переместите вызов здесь
  
    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyser.getByteTimeDomainData(dataArray);
        
      if (canvas) {
        canvas.width = 300;
        canvas.height = 35;
        const canvasCtx = canvas.getContext('2d');
        if (canvasCtx) {
         
          drawVisualizer(canvasCtx, canvas.width, canvas.height, dataArray);
        }
      }
    };
  
    renderFrame();
  
    sourceRef.current = source;
  
    return () => {
      audioContext.close();
    };
  }, []);
  const setupAudioSource = (audioContext: AudioContext) => {
    const audio = new Audio(audiostr);
    const source = audioContext.createMediaElementSource(audio);
    console.log(source, audio)
    source.connect(analyserRef.current!);
    analyserRef.current!.connect(audioContext.destination);
    audio.play();
    return source;
  };
  const drawVisualizer = (
    canvasCtx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    dataArray: Uint8Array
  ) => {
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasCtx.strokeStyle = "rgb(11, 107, 203)";
    canvasCtx.lineWidth = 2;
    canvasCtx.beginPath();
    const sliceWidth = canvasWidth * 1.0 / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * canvasHeight / 2;
  
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
  
      x += sliceWidth;
    }
    canvasCtx.lineTo(800, 400 / 2);
    canvasCtx.stroke();
  };

  return <canvas ref={canvasRef} width={800} height={400} />;
};

export default AudioVisualizer;