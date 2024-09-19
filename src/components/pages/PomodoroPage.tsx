import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Typography, Box, FormControl, FormLabel, Input } from '@mui/joy';
import Sidebar from '../Sidebar';
import Header from '../Header';

const PomodoroTimer: React.FC = () => {
    const [time, setTime] = useState<number>(25 * 60); // Default time 25 minutes
    const [timerOn, setTimerOn] = useState<boolean>(false);
    const [customTime, setCustomTime] = useState<number>(25);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (timerOn && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setTimerOn(false);
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerOn, time]);

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleStartStop = () => {
        setTimerOn(!timerOn);
    };

    const handleReset = () => {
        setTimerOn(false);
        setTime(customTime * 60);
    };

    const handleCustomTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomTime(Number(e.target.value));
    };

    const setCustomTimer = () => {
        setTime(customTime * 60);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Header />
            <Sidebar />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    px: { xs: 2, md: 6 },
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        sm: 'calc(12px + var(--Header-height))',
                        md: 3,
                    },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100dvh',
                    width: '100%',
                    gap: 1,
                    overflow: 'auto'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        mb: 1,
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'start', sm: 'center' },
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="h2">
                        Pomodoro Timer
                    </Typography>
                    <Typography level="h4">
                        {formatTime(time)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <FormControl sx={{ mb: 2, mr: 2, width: '30%' }}>
                        <FormLabel>Set Timer (minutes)</FormLabel>
                        <Input
                            type="number"
                            value={customTime}
                            onChange={handleCustomTimeChange}
                        />
                    </FormControl>
                    <Button onClick={setCustomTimer}>Set Timer</Button>

                    <Box sx={{ mt: 2, display: 'flex' }}>
                        <Button onClick={handleStartStop} sx={{ mr: 2 }}>
                            {timerOn ? 'Pause' : 'Start'}
                        </Button>
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PomodoroTimer;

