import { Sheet, Typography, Chip, Button } from "@mui/joy";
import { Dispatch, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface TableTaskProps {
    task: Task;
    index: number,
    fromColumnId: number;
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void;
    columnName: string;
    chipCustomize: TaskChipCustomize;
    setChipColor: Dispatch<React.SetStateAction<TaskChipCustomize>>;
}

const TableTask: React.FC<TableTaskProps> = ({ task, index, fromColumnId, moveTask, columnName, chipCustomize, setChipColor }) => {
    const ref = useRef<HTMLTableRowElement>(null);

    const [, drop] = useDrop({
        accept: 'TASK',
        hover(item: { index: number, fromColumnId: number}, monitor) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;
            const sourceColumn = item.fromColumnId === fromColumnId;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as DOMRect).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            if (sourceColumn && item.index !== index) {
                moveTask(item.fromColumnId, fromColumnId, dragIndex, hoverIndex);
                item.index = index;
            } else if (!sourceColumn) {
                moveTask(item.fromColumnId, fromColumnId, dragIndex, hoverIndex);
                item.index = index;
                item.fromColumnId = fromColumnId;
            }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { index, fromColumnId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleColorChange = (color: string) => {
        setChipColor(prev => ({ ...prev, [columnName]: color }));
    };

    drag(drop(ref))

    return (
        <tr
            ref={ref}
            style={{
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <td>
                <Sheet
                    variant='outlined'
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: '4px',
                        p: '8px',
                        my: '4px',
                    }}
                >
                    <Typography>{task.content}</Typography>
                    <Chip
                        sx={{
                            backgroundColor: chipCustomize[columnName] || 'var(--joy-palette-primary-softBg)'
                        }}
                    >
                        {columnName}
                    </Chip>
                    <div>
                        <Button onClick={() => handleColorChange('#aa2200')}>Blue</Button>
                        <Button onClick={() => handleColorChange('#bb5566')}>Green</Button>
                        <Button onClick={() => handleColorChange('#cc1177')}>Red</Button>
                    </div>
                </Sheet>
            </td>
        </tr>
    );
};

export default TableTask;