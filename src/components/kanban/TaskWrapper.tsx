import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sheet } from "@mui/joy";
import Task from "./Task";

interface CardWrapperProps {
    task: Task;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ task }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Card',
            card: task,
        }
    });

    const style = ({
        transition,
        transform: CSS.Transform.toString(transform),
    });

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                // invertedColors
                // variant='outlined'
                style={{
                    width: '275px',
                    borderColor: 'red',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: '8px',
                    // transition: transition,
                    // transform: CSS.Transform.toString(transform),
                    // willChange: 'transform',
                    ...style,
                }}
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            // invertedColors
            // variant='outlined'
            style={{
                // display: 'flex',
                // flexDirection: 'column',
                // justifyContent: 'space-between',
                // width: '275px',
                // borderRadius: '8px',
                // padding: '8px',
                // cursor: 'grab',
                // userSelect: 'none',
                // transition: transition,
                // transform: CSS.Transform.toString(transform),
                // willChange: 'transform',
                ...style,
            }}
        >
            <Task
                task={task}
                dndAttributes={attributes}
                dndListeners={listeners}
            />
        </div>
    )
}

export default CardWrapper;