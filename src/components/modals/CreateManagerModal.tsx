import React, { useEffect, useState } from "react";
import { storesContext } from '../../utils/stores';
import { Modal, ModalDialog, ModalClose, Typography, Button, Input, Sheet, FormControl, ToggleButtonGroup, Box, Divider, Textarea, Avatar, ListItemContent, Select, IconButton, Option, Chip, Accordion, AccordionDetails, AccordionSummary, AccordionGroup, accordionDetailsClasses, accordionSummaryClasses } from '@mui/joy';
import { Delete, MusicNote, Person, LibraryBooks, PlayArrow } from '@mui/icons-material';
import RecordingsList, { useRecorder, UseRecorder, AudioRecorder } from "../AudioRecorder";

interface CreateManagerModalProps {
    open: boolean;
    onClose: () => void;
    onCreateManager: (name: string) => void;
}

const CreateManagerModal: React.FC<CreateManagerModalProps> = ({ open, onClose, onCreateManager }) => {
    const [managerName, setManagerName] = useState<string>('');
    const [filter, setFilter] = React.useState('all');
    const [companyName, setCompanyName] = React.useState('');
    const [businessSphere, setBusinessSphere] = React.useState('');
    const [prompts, setPrompts] = React.useState('');
    const [soundFile, setSoundFile] = useState<number>(0);
    const { recorderState, ...handlers }: UseRecorder = useRecorder();
    const { audio } = recorderState;
    const { soundfileStore } = React.useContext(storesContext);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [recordedAudios, setRecordedAudios] = useState<{ id: string, name: string, audio: string }[]>([]);

    const mockVoices = [
        { id: 'voice1', name: 'Мужской голос 1', audio: 'path/to/male1.mp3' },
        { id: 'voice2', name: 'Женский голос 1', audio: 'path/to/female1.mp3' },
        { id: 'voice3', name: 'Мужской голос 2', audio: 'path/to/male2.mp3' },
        { id: 'voice4', name: 'Женский голос 2', audio: 'path/to/female2.mp3' },
    ];

    const handleSubmit = () => {
        if (managerName.trim()) {
            onCreateManager(managerName);
            setManagerName('');
            onClose();
        }
    };

    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const audioUrl = URL.createObjectURL(file);
            const newAudio = { id: file.name, name: file.name, audio: audioUrl };
            setRecordedAudios([...recordedAudios, newAudio]);
            soundfileStore.createOrderFromFile(file);
        }
    };
    const useMediaQuery = (query: string): boolean => {
        const [matches, setMatches] = useState<boolean>(false);
    
        useEffect(() => {
            const mediaQueryList = window.matchMedia(query);
            const documentChangeHandler = () => setMatches(mediaQueryList.matches);
    
            mediaQueryList.addEventListener('change', documentChangeHandler);
    
            // Set the initial state
            setMatches(mediaQueryList.matches);
    
            return () => {
                mediaQueryList.removeEventListener('change', documentChangeHandler);
            };
        }, [query]);
    
        return matches;
    };

    const isMobile = useMediaQuery('(max-width:600px)'); // Check if the screen size is mobile

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                color="primary"
                layout={isMobile ? "fullscreen" : "center"}
                size="lg"
                variant="outlined"
                sx={{
                    maxWidth: '460px',
                    '@media (max-width: 600px)': {
                        maxWidth: '100%',
                        margin: '0 10px',
                    },
                    '@media (max-width: 450px)': {
                        maxWidth: '100vw',
                        margin: '0',
                        borderRadius: 0,
                    },
                }}
            >
                <ModalClose />

                <Sheet sx={{ "& > div": { my: 4 }, maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden', direction: 'rtl', scrollbarWidth: 'none' }} >
                    <Box sx={{ direction: 'ltr' }}>
                        <AccordionGroup
                            variant="plain"
                            transition="0.2s"
                            sx={{
                                overflow: 'auto',
                                maxWidth: 400,
                                borderRadius: 'md',
                                [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]: {
                                    paddingBlock: '1rem',
                                },
                                [`& .${accordionSummaryClasses.button}`]: {
                                    paddingBlock: '1rem',
                                },
                                '@media (max-width: 600px)': {
                                    width: '100%',
                                },
                            }}
                        >
                            <Accordion>
                                <AccordionSummary>
                                    <Avatar color="primary">
                                        <Person />
                                    </Avatar>
                                    <ListItemContent>
                                        <Typography level="title-md">Менеджер</Typography>
                                        <Typography level="body-sm">
                                            Настройки менеджера
                                        </Typography>
                                    </ListItemContent>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormControl>
                                        <Input
                                            value={managerName}
                                            onChange={(e) => setManagerName(e.target.value)}
                                            placeholder="Имя менеджера"
                                            sx={{ mb: 2 }}
                                        />
                                        <ToggleButtonGroup
                                            sx={{
                                                justifyContent: "center",
                                                position: 'relative',
                                                display: 'flex',
                                                '@media (max-width: 450px)': {
                                                    flexDirection: 'column',
                                                    alignItems: 'stretch',
                                                },
                                            }}
                                            color="primary"
                                            value={filter}
                                            onChange={(_, newFilter) => setFilter(newFilter!)}
                                        >
                                            <Button value="входящие" sx={{ flex: 1 }}>Входящие</Button>
                                            <Button value="исходящие" sx={{ flex: 1 }}>Исходящие</Button>
                                            <Button value="all" sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography
                                                    level="body-xs"
                                                    color="danger"
                                                    sx={{ position: 'absolute', top: '0.1em', left: '5.2rem', fontSize: '0.8em', lineHeight: '1' }}
                                                >
                                                    Beta
                                                </Typography>
                                                Все
                                            </Button>
                                        </ToggleButtonGroup>
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary>
                                    <Avatar color="primary">
                                        <MusicNote />
                                    </Avatar>
                                    <ListItemContent>
                                        <Typography level="title-md">Аудизоапись</Typography>
                                        <Typography level="body-sm">
                                            Выберите запись для вашей компании
                                        </Typography>
                                    </ListItemContent>
                                </AccordionSummary>
                                <AccordionDetails>

                                    <FormControl>
                                        <Typography level="body-sm" mb={1}>Выберите голос</Typography>
                                        <Select
                                            value={selectedVoice}
                                            onChange={(_, newValue) => setSelectedVoice(newValue as string)}
                                            placeholder="Выберите голос"
                                            sx={{ mb: 2 }}
                                        >
                                            {mockVoices.map((voice) => (
                                                <Option key={voice.id} value={voice.id}>
                                                    <Box
                                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                                                    >
                                                        {voice.name}
                                                        <IconButton
                                                            color='primary'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const audioElement = new Audio(voice.audio);
                                                                audioElement.play();
                                                            }}
                                                        >
                                                            <PlayArrow />
                                                        </IconButton>
                                                    </Box>
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Divider>
                                        <Chip sx={{ my: 2 }} variant="soft" color="neutral" size="sm">
                                            Запишите свой голос
                                        </Chip>
                                    </Divider>

                                    <AudioRecorder recorderState={recorderState} handlers={handlers} />

                                    <input
                                        type="file"
                                        id="audioFileInput"
                                        style={{ display: 'none' }}
                                        accept="audio/*"
                                        onChange={handleAudioUpload}
                                    />
                                    <Select
                                        value={soundFile}
                                        onChange={(_, nv) => { if (nv !== null) setSoundFile(nv) }}
                                        startDecorator={<MusicNote />}
                                        endDecorator={null}
                                        indicator=''
                                    >
                                        {recordedAudios.map((file) => (
                                            <Option key={file.id} value={file.id}>
                                                <Box
                                                    sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            width: '75%'
                                                        }}
                                                    >
                                                        {file.name}
                                                    </Typography>
                                                    <IconButton
                                                        color='primary'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const audioElement = new Audio(file.audio);
                                                            audioElement.play();
                                                        }}
                                                    >
                                                            <PlayArrow />
                                                        </IconButton>
                                                    <IconButton
                                                        color='danger'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRecordedAudios(recordedAudios.filter(a => a.id !== file.id));
                                                            soundfileStore.deleteOrder(Number(file.id)); // Convert id to number
                                                        }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Box>
                                            </Option>
                                        ))}
                                    </Select>

                                    <RecordingsList audio={audio} />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary>
                                    <Avatar color="primary">
                                        <LibraryBooks />
                                    </Avatar>
                                    <ListItemContent>
                                        <Typography level="title-md">Инструкции/База знаний</Typography>
                                        <Typography level="body-sm">
                                            Напишите инструкции
                                        </Typography>
                                    </ListItemContent>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ mt: 'auto' }}>
                                        <Divider sx={{ my: 2 }} />
                                        <Input
                                            placeholder="Название фирмы"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            sx={{ mb: 2 }}
                                        />
                                        <Input
                                            placeholder="Сфера деятельности"
                                            value={businessSphere}
                                            onChange={(e) => setBusinessSphere(e.target.value)}
                                            sx={{ mb: 2 }}
                                        />
                                        <Textarea
                                            placeholder="Промпты"
                                            minRows={3}
                                            value={prompts}
                                            onChange={(e) => setPrompts(e.target.value)}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionGroup>
                    </Box>
                    <Button
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Добавить
                    </Button>
                </Sheet>
            </ModalDialog>
        </Modal>
    )
}

export default CreateManagerModal;