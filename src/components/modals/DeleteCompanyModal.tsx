
import React from 'react';
import { Modal, ModalDialog, Sheet, Button, Stack, Typography } from '@mui/joy';

interface DeleteCompanyModalProps {
    id: number;
    open: boolean;
    onClose: () => void;
}

const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({ id, open, onClose }) => {

    const handleSubmit = () => {
        fetch(`http://127.0.0.1:8000/company/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Ошибка:', error));
        onClose(); // Закрыть модальное окно после отправки формы
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog size='sm' maxWidth='460px'>
            <Typography textAlign="center" level="h3">
              Удалить?
            </Typography>
                <Sheet
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        padding: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                       
                    >
                        <Button >Отмена</Button>
                        <Button color='danger' onClick={handleSubmit}>Удалить</Button>
                    </Stack>

                </Sheet>
            </ModalDialog>
        </Modal>
    );
};

export default DeleteCompanyModal;
