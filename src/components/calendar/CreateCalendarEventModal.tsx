import { Modal, Box, Typography, Button, Input } from "@mui/joy";
import { useState } from "react";

const CreateCalendarEventModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onCreate: (event: Omit<CalendarEvents, 'id'>) => void;
}> = ({ open, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [startHour, setStartHour] = useState<number>(0);
    const [endHour, setEndHour] = useState<number>(1);
    const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));

    const handleSubmit = () => {
        if (title && new Date(date).toString() !== 'Invalid Date' && endHour > startHour) {
            onCreate({ title, startHour, endHour, date: new Date(date) });
            setTitle('');
            setStartHour(0);
            setEndHour(1);
            setDate(new Date().toISOString().substring(0, 10));
            onClose();
        } else {
            alert('Please fill all fields correctly.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 1 }}>
                <Typography level="h4">Create Event</Typography>
                <Input
                    fullWidth
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    fullWidth
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <Input
                    fullWidth
                    type="number"
                    placeholder="Start Hour"
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                />
                <Input
                    fullWidth
                    type="number"
                    placeholder="End Hour"
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateCalendarEventModal;