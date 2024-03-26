import React, { useEffect, useRef } from 'react';

export type AudioVisualizerProps = {
    mediaStream: MediaStream;
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({mediaStream}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
  useEffect(() => {
    if (!mediaStream) return;

    const canvas = canvasRef.current;
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
  
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    analyser.connect(audioContext.destination); // Это подключение может быть опциональным, в зависимости от того, хотите ли вы слышать вывод через динамики.
    sourceRef.current = source;
  
    const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        analyser.getByteTimeDomainData(dataArray);
        
        if (canvas) {
            const canvasCtx = canvas.getContext('2d');
           
            if (canvasCtx) {
                drawVisualizer(canvasCtx, canvas.width, canvas.height, dataArray);
            }
        }
    };
  
    renderFrame();
  
    return () => {
        audioContext.close();
    };
}, [mediaStream]);
 
  const drawVisualizer = (
    canvasCtx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    dataArray: Uint8Array
) => {
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(11, 107, 203)';
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

    canvasCtx.lineTo(canvasWidth, canvasHeight / 2);
    canvasCtx.stroke();
};

  return <canvas ref={canvasRef} width={500} height={150} />;
};

export default AudioVisualizer;