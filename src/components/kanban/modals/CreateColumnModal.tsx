import { Box, Button, Input, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useState, useEffect, useContext } from "react";
import { storesContext } from "../../../utils/stores";

interface CreateColumnModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({ open, onClose }) => {
    const [columnName, setColumnName] = useState('');
    const [columnColor, setColumnColor] = useState('#ffffff');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColumnName(e.target.value);
    }

    const { useKanbanStore } = useContext(storesContext);
    const { addColumn } = useKanbanStore();

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
        addColumn({
            title: columnName,
            tag_color: columnColor,
        });
        setColumnName('');
        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                setColumnName('');
                setColumnColor('#ffffff');
                onClose();
            }}
            sx={{
                display: 'flex', minHeight: '100dvh', flex: 1
            }}
        >
            <ModalDialog
                size='lg'
                color="primary"
                layout={isMobile ? "fullscreen" : 'center'}
                variant="outlined"
            >
                <Box sx={{ display: 'flex', width: '100%', pt: 'var(--Header-height)' }}>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={1}
                        width={'100%'}
                    >
                        <Typography level="h3">
                            Create Column
                        </Typography>
                        <Input
                            placeholder="Title"
                            name="title"
                            variant="outlined"
                            fullWidth
                            value={columnName}
                            onChange={handleInputChange}
                        />
                        <Input
                            placeholder="Цвет"
                            name="columnName"
                            type="color"
                            variant="outlined"
                            fullWidth
                            value={columnColor}
                            onChange={(e) => { setColumnColor(e.target.value) }}
                        />
                        <Button
                            onClick={handleCreateTask}
                            variant="solid"
                            sx={{
                                mt: 2
                            }}
                        >
                            Create Column
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

export default CreateColumnModal;