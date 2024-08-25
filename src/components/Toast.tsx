import { Close } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/joy';
import { useToastStore } from '../utils/stores/ToastStore';


const Toast = () => {
    const { open, message, color, close } = useToastStore();

    return (
        <Snackbar
            variant='soft'
            color={color}
            open={open}
            autoHideDuration={1500}
            onClose={() => close()}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            endDecorator={
                <Button
                    onClick={() => close()}
                    size='sm'
                    variant='soft'
                    color={color}
                >
                    <Close />
                </Button>
            }
        >
            {message}
        </Snackbar>
    );
}

export default Toast;