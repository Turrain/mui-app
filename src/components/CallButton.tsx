import { useEffect, useRef, useState } from 'react';
import { CssBaseline, GlobalStyles, IconButton, Input, Sheet, Typography, Box, Grid, Button } from '@mui/joy';
import { Cancel, PhoneEnabled } from '@mui/icons-material';
import http from '../utils/api/http-client';

const CallButton = () => {
    const [open, setOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setOpen((prev) => !prev);
        setPhoneNumber('');
    };

    const handleCall = async () => {
        console.log(`Calling ${phoneNumber}`);
        // const response = await http.post(`${ASTERISK_ARI_URI}channels?endpoint=PJSIP/${phoneNumber}@provider-endpoint&extension=1000&context=Autocall&timeout=30&api_key=${ASTERISK_ARI_USER}:${ASTERISK_ARI_PASS}`, {});
        // console.log(response.data);
        // setOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    const handlePhoneInput = (number: number) => {
        setPhoneNumber(phoneNumber + String(number));
    }

    useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <>
            <CssBaseline />
            <GlobalStyles styles={{
                body: { margin: 0 },
                '#root': { height: '100vh' }
            }} />

            <IconButton
                onClick={handleToggle}
                sx={{
                    position: 'fixed',
                    right: 32,
                    bottom: 32,
                    borderRadius: '50%',
                    '--IconButton-size': '48px',
                    zIndex: 9999
                }}
                variant='soft'
                color='success'
            >
                <PhoneEnabled />
            </IconButton>

            {open && (
                <Sheet
                    ref={containerRef}
                    variant='outlined'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 16,
                        bottom: 96,
                        borderRadius: 8,
                        bgcolor: 'background.body',
                        p: 3,
                        width: 300,
                        zIndex: 1000
                    }}
                >
                    <Typography
                        component="h2"
                        level="title-lg"
                        sx={{ mb: 2 }}
                    >
                        Введите номер телефона
                    </Typography>

                    <Input
                        fullWidth
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Номер телефона"
                        endDecorator={
                            <IconButton onClick={() => setPhoneNumber('')}>
                                <Cancel />
                            </IconButton>
                        }
                    />

                    <Box sx={{ my: 4 }}>
                        <Grid
                            justifyContent="space-around"
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                            sx={{ flexGrow: 1 }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
                                <Grid xs={2} sm={4} md={4} justifyItems="center" key={i}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            justifyItems: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Button
                                            key={i}
                                            onClick={() => handlePhoneInput(i)}
                                            sx={{
                                                width: '48px',
                                                height: '48px',
                                            }}
                                            variant="outlined"
                                        >
                                            {i}
                                        </Button>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <IconButton
                        onClick={handleCall}
                        variant="soft"
                        color='success'
                        sx={{
                            borderRadius: '50%',
                            '--IconButton-size': '48px',
                        }}
                    >
                        <PhoneEnabled />
                    </IconButton>
                </Sheet>
            )}
        </>
    );
};

export default CallButton;