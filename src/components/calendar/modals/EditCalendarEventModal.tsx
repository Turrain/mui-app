import { Button, IconButton, Input, Modal, ModalClose, ModalDialog, Stack, styled, Typography } from "@mui/joy"
import { format, formatISO } from "date-fns";
import { ru } from "date-fns/locale";
import { FC, useContext, useEffect, useState } from "react";
import { storesContext } from "../../../utils/stores";
import { Delete } from "@mui/icons-material";

interface EditCalendarEventModalProps {
    id: number;
    open: boolean;
    onClose: () => void;
    updateEvent: (calendarEvent: any) => void;
    deleteEvent: (id: number) => void;
}

const Textarea = styled('textarea', {
    name: 'Textarea',
    slot: 'root'
})(({ theme }) => ({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.vars.palette.neutral.outlinedBorder,
    backgroundColor: theme.vars.palette.background.surface,
    fontSize: theme.vars.fontSize.md,
    borderRadius: 6,
    minHeight: '100px',
    resize: 'none',
    display: 'block',
    padding: '8px',
    fontFamily: theme.vars.fontFamily.body,
    '&:focus': {
        outline: `1px solid ${theme.vars.palette.primary[500]}`,
    }
}));

const EditCalendarEventModal: FC<EditCalendarEventModalProps> = ({ id, open, onClose, updateEvent }) => {
    const [title, setTitle] = useState<string>('');
    const [start, setStart] = useState<Date>();
    const [end, setEnd] = useState<Date>();

    const { useCalendarStore } = useContext(storesContext);

    useEffect(() => {
        const event = useCalendarStore.getState().getEventById(id);
        if (event) {
            setTitle(event.title);
            setStart(event.start);
            setEnd(event.end);
        }
    }, [id]);

    const handleEditCalendarEvent = () => {
        updateEvent({
            title: title,
            start: formatISO(start!, { representation: 'complete' }),
            end: formatISO(end!, { representation: 'complete' })
        });
        setTitle('');
        onClose();
    }

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

    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <ModalDialog
                size='lg'
                color="primary"
                layout={isMobile ? "fullscreen" : 'center'}
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
                <IconButton>
                    <Delete />
                </IconButton>
                <ModalClose />
                <Typography level="title-lg">
                    Редактировать событие
                </Typography>
                <Input
                    placeholder="Измените название"
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                />
                <Stack
                    flexDirection={'row'}
                    gap={2}
                >
                    <Typography>
                        {
                            start &&
                            format(start, 'EEEE, dd LLL yyyy', { locale: ru }).charAt(0).toUpperCase() +
                            format(start, 'EEEE, dd LLL yyyy', { locale: ru }).slice(1)
                        }
                    </Typography>
                    <Typography>
                        {
                            end && start &&
                            format(start, 'HH:mm', { locale: ru }) + ' - ' +
                            format(end, 'HH:mm', { locale: ru })
                        }
                    </Typography>
                </Stack>
                <Textarea
                    placeholder="Описание"
                />
                <Button
                    onClick={handleEditCalendarEvent}
                >
                    Изменить
                </Button>
            </ModalDialog>
        </Modal>
    )
}

export default EditCalendarEventModal;