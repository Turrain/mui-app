import { Box, Input, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import Header from "../Header";
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
                display: 'flex', minHeight: '100dvh'
            }}
        >
            <ModalDialog
                size='md'
                color="primary"
                layout="fullscreen"
                variant="outlined"
            >
                <Box sx={{ display: 'flex', minHeight: '100dvh', width: '100%' }}>
                    <Header />
                    <Box component="main" className="MainContent" sx={{ flex: 1 }}>
                        <MyMessages />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                        <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                    </Box>
                </Box>
                <ModalClose />
            </ModalDialog>
        </Modal>
    );
}


export default CreateTaskModal;