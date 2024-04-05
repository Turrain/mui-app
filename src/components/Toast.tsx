import { Close } from '@mui/icons-material';
import { Button, ColorPaletteProp, Snackbar } from '@mui/joy';
import React from 'react';

interface ToastProp {
    open: boolean,
    color: ColorPaletteProp,
    text: string,
    onClose: () => void
}

const Toast: React.FC<ToastProp> = ({ open, onClose, color, text }) => {

    return (
        <Snackbar
            variant='soft'
            color={color}
            open={open}
            autoHideDuration={1500}
            onClose={() => onClose()}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            endDecorator={
                <Button
                    onClick={() => onClose()}
                    size='sm'
                    variant='soft'
                    color={color}
                >
                    <Close />
                </Button>
            }
        >
            {text}
        </Snackbar>
    );
}

export default Toast;