import { Button, Chip, Sheet, Stack, Typography } from '@mui/joy';
import React, { Dispatch, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface TableViewProps {
    columns: Column[];
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string) => void;
}

const TableView: React.FC<TableViewProps> = ({ columns, moveCard }) => {
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
                    <TableInside key={`kanban-table-${index}`} column={column} moveCard={moveCard} />
                </Sheet>
            ))}
        </Stack>
    );
};

const TableInside: React.FC<{ column: Column; moveCard: (fromColumnId: string, toColumnId: string, taskId: string) => void }> = ({ column, moveCard }) => {
    const [chipColor, setChipColor] = useState({ [column.title]: column.tagColor });

    const [{ isOver }, drop] = useDrop({
        accept: 'CARD',
        drop: (item: { taskId: string; fromColumnId: string }) => {
            moveCard(item.fromColumnId, column.id, item.taskId);
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
                            fromColumnId={column.id}
                            moveCard={moveCard}
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
    fromColumnId: string;
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string) => void;
    columnName: string;
    chipCustomize: TaskChipCustomize;
    setChipColor: Dispatch<React.SetStateAction<TaskChipCustomize>>;
}> = ({
    task,
    fromColumnId,
    moveCard,
    columnName,
    chipCustomize,
    setChipColor
}) => {
        const [{ isDragging }, drag] = useDrag({
            type: 'CARD',
            item: { taskId: task.id, fromColumnId },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: 'CARD',
            drop: (item: { taskId: string; fromColumnId: string }) => {
                if (item.fromColumnId !== fromColumnId) {
                    moveCard(item.fromColumnId, fromColumnId, item.taskId);
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