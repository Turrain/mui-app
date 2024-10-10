import { Button, Input, Modal, ModalClose, ModalDialog, Stack, styled, Typography } from "@mui/joy"
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FC, useEffect, useState } from "react";
import { SlotInfo } from "react-big-calendar";

interface CreateCalendarEventModalProps {
    open: boolean;
    onClose: () => void;
    createEvent: (calendarEvent: any) => void;
    slotInfo: SlotInfo;
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

const CreateCalendarEventModal: FC<CreateCalendarEventModalProps> = ({ open, onClose, createEvent, slotInfo }) => {
    const [title, setTitle] = useState('');
    
    const handleCreateCalendarEvent = () => {
        createEvent({
            title: title,
            start: slotInfo.start.toISOString(),
            end: slotInfo.end.toISOString()
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
                <ModalClose />
                <Typography level="title-lg">
                    Создать событие
                </Typography>
                <Input
                    placeholder="Добавьте название"
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                />
                <Stack
                    flexDirection={'row'}
                    gap={2}
                >
                    <Typography>
                        {
                            slotInfo &&
                            format(slotInfo.start, 'EEEE, dd LLL yyyy', { locale: ru }).charAt(0).toUpperCase() +
                            format(slotInfo.start, 'EEEE, dd LLL yyyy', { locale: ru }).slice(1)
                        }
                    </Typography>
                    <Typography>
                        {
                            slotInfo &&
                            format(slotInfo.start, 'HH:mm', { locale: ru }) + ' - ' +
                            format(slotInfo.end, 'HH:mm', { locale: ru })
                        }
                    </Typography>
                </Stack>
                <Textarea
                    placeholder="Описание"
                />
                <Button
                onClick={handleCreateCalendarEvent}
                >
                    Создать
                </Button>
            </ModalDialog>
        </Modal>
    )
}

export default CreateCalendarEventModal;