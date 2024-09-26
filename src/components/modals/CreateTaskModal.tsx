import { Box, Button, Input, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import http from '../../utils/api/http-client';

interface CreateManagerModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateTaskModal: React.FC<CreateManagerModalProps> = ({ open, onClose }) => {
    const [taskName, setTaskName] = React.useState('');
    const [taskCompany, setTaskCompany] = React.useState('');
    const [taskPhone, setTaskPhone] = React.useState('');
    const [taskComment, setTaskComment] = React.useState('');
    const [taskTask, setTaskTask] = React.useState('');
    const [taskDateTime, setTaskDateTime] = React.useState(new Date(Date.now()).toISOString());

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

    const handleCreateTask = async () => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const event = {
            summary: taskName + " " + taskCompany,
            description: taskComment + "\n" + taskTask + "\n" + taskPhone,
            start_date_time: taskDateTime,
            end_date_time: new Date(new Date(taskDateTime).getTime() + 60 * 60 * 1000).toISOString(),
            time_zone: timeZone
        };

        try {
            await http.post('/api/add-event', event);
            alert('Event created: ' + event.summary);
            onClose();
        } catch (error) {
            console.error("Error creating event: ", error);
            alert('Error creating event');
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
            sx={{
                display: 'flex', minHeight: '100dvh', flex: 1
            }}
        >
            <ModalDialog
                size='lg'
                color="primary"
                layout={isMobile ? "fullscreen" : 'center'}
                variant="outlined"
                sx={{

                }}
            >
                <Box sx={{ display: 'flex', width: '100%', pt: 'var(--Header-height)' }}>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={1}
                        width={'100%'}
                    >
                        <Typography level="h3">Create Task</Typography>
                        <Input
                            placeholder="Name"
                            variant="outlined"
                            fullWidth
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                        <Input
                            placeholder="Company"
                            variant="outlined"
                            fullWidth
                            value={taskCompany}
                            onChange={(e) => setTaskCompany(e.target.value)}
                        />
                        <Input
                            placeholder="Phone"
                            variant="outlined"
                            fullWidth
                            value={taskPhone}
                            onChange={(e) => setTaskPhone(e.target.value)}
                        />
                        <Input
                            placeholder="Comment"
                            variant="outlined"
                            fullWidth
                            value={taskComment}
                            onChange={(e) => setTaskComment(e.target.value)}
                        />
                        <Input
                            placeholder="Task"
                            variant="outlined"
                            fullWidth
                            value={taskTask}
                            onChange={(e) => setTaskTask(e.target.value)}
                        />
                        <Input
                            placeholder="Datetime"
                            variant="outlined"
                            fullWidth
                            value={taskDateTime}
                            onChange={(e) => setTaskDateTime(e.target.value)}
                        />
                        <Button
                            onClick={handleCreateTask}
                        >
                            Create Task
                        </Button>
                    </Box>
                </Box>
                <ModalClose
                    sx={{
                        mt: isMobile ? 'var(--Header-height)' : 0
                    }}
                />
            </ModalDialog>
        </Modal>
    );
}


export default CreateTaskModal;