import { Close } from "@mui/icons-material";
import { Box, Chip, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { addHours, format } from "date-fns";
import { useDrag } from "react-dnd";

interface DraggableEventProps {
    event: CalendarEvents;
    onDelete: (id: number) => void;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, onDelete }) => {
    const [, drag] = useDrag({
        type: 'EVENT',
        item: event,
    });

    return (
        <Sheet
            ref={drag}
            variant="solid"
            color="primary"
            sx={{
                margin: '8px',
                cursor: 'move',
                position: 'absolute',
                width: '100%',
                borderRadius: '8px',
                padding: '8px',
                zIndex: 5,
            }}
            invertedColors
        >
            <Stack
                flexDirection={'column'}
            >
                <Typography
                    level="title-sm"
                >
                    {event.title}
                </Typography>
                <Typography
                    level="body-xs"
                >
                    {format(event.date, 'HH:mm')} - {format(addHours(event.date, 1), 'HH:mm')}
                </Typography>
            </Stack>
            {/* <IconButton
                onClick={() => onDelete(event.id)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
            >
                <Close fontSize="small" />
            </IconButton> */}
        </Sheet>
    );
};

export default DraggableEvent;