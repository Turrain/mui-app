import { Circle, Delete, PlayArrow, RecordVoiceOver, Settings, Stop, Upload } from "@mui/icons-material";
import { Box, Button, ButtonGroup, IconButton, LinearProgress, Sheet, Stack, Typography } from "@mui/joy";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import AudioVisualizer from "./AudioVisualizer";
import { storesContext } from "../utils/stores";
import React from "react";

export type Recorder = {
    recordingMinutes: number;
    recordingSeconds: number;
    initRecording: boolean;
    mediaStream: MediaStream | null;
    mediaRecorder: MediaRecorder | null;
    audio: string | null;
};

export type UseRecorder = {
    recorderState: Recorder;
    startRecording: () => void;
    cancelRecording: () => void;
    saveRecording: () => void;
};

export type RecorderControlsProps = {
    recorderState: Recorder;
    handlers: {
        startRecording: () => void;
        cancelRecording: () => void;
        saveRecording: () => void;
    };
};

export type RecordingsListProps = {
    audio: string | null;
};

export type Interval = null | number | ReturnType<typeof setInterval>;
export type SetRecorder = Dispatch<SetStateAction<Recorder>>;
export type SetRecordings = Dispatch<SetStateAction<Audio[]>>;
export type AudioTrack = MediaStreamTrack;
export type MediaRecorderEvent = {
    data: Blob;
};
export async function startRecording(setRecorderState: SetRecorder) {
    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        setRecorderState((prevState) => {
            return {
                ...prevState,
                initRecording: true,
                mediaStream: stream,
            };
        });
    } catch (err) {
        console.log(err);
    }
}

export function saveRecording(recorder: any) {
    if (recorder.state !== "inactive") recorder.stop();
}

export function deleteAudio(audioKey: string, setRecordings: SetRecordings) {
    setRecordings((prevState) => prevState.filter((record) => record.key !== audioKey));
}
export function formatMinutes(minutes: number) {
    return minutes < 10 ? `0${minutes}` : `${minutes}`;
}

export function formatSeconds(seconds: number) {
    return seconds < 10 ? `0${seconds}` : `${seconds}`;
}

const initialState: Recorder = {
    recordingMinutes: 0,
    recordingSeconds: 0,
    initRecording: false,
    mediaStream: null,
    mediaRecorder: null,
    audio: null,
};

export function useRecorder() {
    const [recorderState, setRecorderState] = useState<Recorder>(initialState);

    useEffect(() => {
        const MAX_RECORDER_TIME = 5;
        let recordingInterval: Interval = null;

        if (recorderState.initRecording)
            recordingInterval = setInterval(() => {
                setRecorderState((prevState: Recorder) => {
                    if (
                        prevState.recordingMinutes === MAX_RECORDER_TIME &&
                        prevState.recordingSeconds === 0
                    ) {
                        typeof recordingInterval === "number" && clearInterval(recordingInterval);
                        return prevState;
                    }

                    if (prevState.recordingSeconds >= 0 && prevState.recordingSeconds < 59)
                        return {
                            ...prevState,
                            recordingSeconds: prevState.recordingSeconds + 1,
                        };
                    else if (prevState.recordingSeconds === 59)
                        return {
                            ...prevState,
                            recordingMinutes: prevState.recordingMinutes + 1,
                            recordingSeconds: 0,
                        };
                    else return prevState;
                });
            }, 1000);
        else typeof recordingInterval === "number" && clearInterval(recordingInterval);

        return () => {
            typeof recordingInterval === "number" && clearInterval(recordingInterval);
        };
    });

    useEffect(() => {
        setRecorderState((prevState) => {
            if (prevState.mediaStream)
                return {
                    ...prevState,
                    mediaRecorder: new MediaRecorder(prevState.mediaStream),
                };
            else return prevState;
        });
    }, [recorderState.mediaStream]);

    useEffect(() => {
        const recorder = recorderState.mediaRecorder;
        let chunks: Blob[] = [];

        if (recorder && recorder.state === "inactive") {
            recorder.start();

            recorder.ondataavailable = (e: MediaRecorderEvent) => {
                chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                chunks = [];

                setRecorderState((prevState: Recorder) => {
                    if (prevState.mediaRecorder)
                        return {
                            ...initialState,
                            audio: window.URL.createObjectURL(blob),
                        };
                    else return initialState;
                });
            };
        }

        return () => {
            if (recorder) recorder.stream.getAudioTracks().forEach((track: AudioTrack) => track.stop());
        };
    }, [recorderState.mediaRecorder]);

    return {
        recorderState,
        startRecording: () => startRecording(setRecorderState),
        cancelRecording: () => setRecorderState(initialState),
        saveRecording: () => saveRecording(recorderState.mediaRecorder),
    };
}
export function generateKey() {
    return uuidv4();
}
export function useRecordingsList(audio: string | null) {
    const [recordings, setRecordings] = useState<Audio[]>([]);

    useEffect(() => {
        if (audio)
            setRecordings((prevState: Audio[]) => {
                return [...prevState, { key: generateKey(), audio }];
            });
    }, [audio]);

    return {
        recordings,
        deleteAudio: (audioKey: string) => deleteAudio(audioKey, setRecordings),
    };
}

export default function RecordingsList({ audio }: RecordingsListProps) {
    const { recordings, deleteAudio } = useRecordingsList(audio);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [durations, setDurations] = useState<{ [key: string]: number }>({});

    const { soundfileStore } = React.useContext(storesContext);

    return (
        <div className="recordings-container">
            {recordings.length > 0 ? (
                <>
                    <Stack spacing={2}>
                        {recordings.map((record) => (
                            <Sheet
                                key={record.key}
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1,
                                }}
                            >
                                <audio
                                    id={`audio-${record.key}`}
                                    src={record.audio}
                                    hidden
                                    onTimeUpdate={(e) => {
                                        const target = e.target as HTMLAudioElement;
                                        const progress = (target.currentTime / target.duration) * 100;
                                        const progressBar = document.getElementById(`progress-${record.key}`);
                                        if (progressBar) {
                                            setProgress(prevState => ({
                                                ...prevState,
                                                [record.key]: progress,
                                            }));

                                        }
                                    }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        const audioElement = document.getElementById(`audio-${record.key}`) as HTMLAudioElement;
                                        if (audioElement) audioElement.play();
                                    }}
                                >
                                    <PlayArrow />
                                </IconButton>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress value={progress[record.key]} determinate sx={{ width: '100%' }} id={`progress-${record.key}`} />
                                </Box>
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        soundfileStore.createOrderFromBlob(record.audio, record.key);
                                    }}
                                >
                                    <Upload />
                                </IconButton>
                                <IconButton
                                    color="danger"
                                    onClick={() => deleteAudio(record.key)}
                                >
                                    <Delete />
                                </IconButton>
                            </Sheet>
                        ))}
                    </Stack>

                </>
            ) : (
                <div className="no-records">
                    <Typography level="body-sm" fontWeight="sm" textColor="common.white" sx={{ mixBlendMode: 'difference' }}>
                        У вас нет записей
                    </Typography>
                </div>
            )}
        </div>
    );
}

export function AudioRecorder({ recorderState, handlers }: RecorderControlsProps) {
    const { recordingMinutes, recordingSeconds, initRecording, audio } = recorderState;
    const { startRecording, saveRecording, cancelRecording } = handlers;
    return (
        <div className="controls-container">
            <div className="recorder-display">
                <div className="recording-time">

                    {initRecording && <LinearProgress

                        variant="outlined"
                        color="primary"
                        size="sm"
                        thickness={12}

                        sx={{
                            '--LinearProgress-radius': '20px',
                            '--LinearProgress-thickness': '24px',
                        }}
                    >
                        <Typography
                            level="body-xs"
                            fontWeight="xl"
                            textColor="common.white"
                            sx={{ mixBlendMode: 'difference' }}
                        >
                            Запись... ({formatMinutes(recordingMinutes)}:{formatSeconds(recordingSeconds)})
                        </Typography>
                    </LinearProgress>}

                </div>
                <Box display="flex" sx={{ my: 1 }} justifyContent="center" alignItems="center" flexDirection="column">
                    <IconButton 
                        sx={{width: 40}}
                        color={recordingSeconds === 0 ? "danger" : "danger"} 
                        onClick={recordingSeconds === 0 ? startRecording : saveRecording}
                    >
                        {recordingSeconds === 0 ? <Circle /> : <Stop />}
                    </IconButton>
                <Typography
                    level="body-sm"
                    fontWeight="sm"
                    textColor="common.white"
                    sx={{ mixBlendMode: 'difference', ml: 2 }}
                >
                    {recordingSeconds === 0 ? 'Начать звукозапись' : 'Остановить звукозапись'}
                </Typography>
                       
                  
                </Box>
            </div>
       
            {recorderState.mediaStream && <AudioVisualizer mediaStream={recorderState.mediaStream} />}

        </div>
    );
}
