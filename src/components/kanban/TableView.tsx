import { Button, Chip, Sheet, Stack, Typography } from '@mui/joy';
import React, { Dispatch, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface TableViewProps {
    columns: Column[];
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void;
}

const TableView: React.FC<TableViewProps> = ({ columns, moveTask }) => {
    return (
        <Stack
            sx={{
                display: 'flex',
                gap: '20px',
                my: 2,
            }}
        >
            {columns.map((column, index) => (
                <Sheet
                    key={`table-${index}`}
                    sx={{
                        padding: '16px',
                        borderRadius: '4px',
                    }}
                >
                    <TableInside key={`kanban-table-${index}`} column={column} moveTask={moveTask} />
                </Sheet>
            ))}
        </Stack>
    );
};

const TableInside: React.FC<{
    column: Column;
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void
}> = ({ column, moveTask }) => {
    const [chipColor, setChipColor] = useState({ [column.title]: column.tagColor });

    const [{ isOver }, drop] = useDrop({
        accept: 'CARD',
        drop: (item: { index: number; fromColumnId: number }) => {
            moveTask(item.fromColumnId, column.id, item.index, column.tasks.length);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div>
            <Typography
                ref={drop}
                level='title-lg'
                sx={{
                    borderColor: isOver ? 'lightgray' : 'transparent',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    p: '10px',
                    cursor: 'pointer',
                }}
            >
                {column.title}
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {column.tasks.map((task, index) => (
                        <DraggableTask
                            key={`drag-task-${index}`}
                            task={task}
                            index={index}
                            fromColumnId={column.id}
                            moveTask={moveTask}
                            columnName={column.title}
                            chipCustomize={chipColor}
                            setChipColor={setChipColor}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DraggableTask: React.FC<{
    task: Task;
    index: number,
    fromColumnId: number;
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void;
    columnName: string;
    chipCustomize: TaskChipCustomize;
    setChipColor: Dispatch<React.SetStateAction<TaskChipCustomize>>;
}> = ({
    task,
    index,
    fromColumnId,
    moveTask,
    columnName,
    chipCustomize,
    setChipColor
}) => {
        const [{ isDragging }, drag] = useDrag({
            type: 'CARD',
            item: { index, fromColumnId },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: 'CARD',
            drop: (item: { index: number; fromColumnId: number }) => {
                if (item.fromColumnId !== fromColumnId) {
                    moveTask(item.fromColumnId, fromColumnId, item.index, index);
                }
            },
        });

        const handleColorChange = (color: string) => {
            setChipColor(prev => ({ ...prev, [columnName]: color }));
        };

        return (
            <tr
                ref={(node) => drag(drop(node))}
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

export default TableView;