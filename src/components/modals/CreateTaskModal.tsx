import { Box, Input, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import MyMessages from "../MyMessages";

interface CreateManagerModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateTaskModal: React.FC<CreateManagerModalProps> = ({ open, onClose }) => {

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
                <Box sx={{ display: 'flex', minHeight: '100dvh', width: '100%' }}>
                    <Box>
                        <MyMessages />
                    </Box>
                    {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                    </Box> */}
                </Box>
                <ModalClose />
            </ModalDialog>
        </Modal>
    );
}


export default CreateTaskModal;