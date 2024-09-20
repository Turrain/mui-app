import { Chip, ColorPaletteProp, Sheet, Stack, Typography } from '@mui/joy';
import React from 'react';
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
            {columns.map((column) => (
                <Sheet
                    key={column.id}
                    sx={{
                        padding: '16px',
                        borderRadius: '4px',
                    }}
                >
                    <TableInside column={column} moveCard={moveCard} />
                </Sheet>
            ))}
        </Stack>
    );
};

const TableInside: React.FC<{ column: Column; moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void }> = ({ column, moveCard }) => {
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
                    // backgroundColor: isOver ? 'lightgray' : 'transparent',
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
                    {column.tasks.map((task) => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            fromColumnId={column.id}
                            moveCard={moveCard}
                            columnName={column.title}
                            chipCustomize={
                                {
                                    'To Do': 'var(--joy-palette-primary-softBg)',
                                    'In Progress': 'var(--joy-palette-warning-softBg)',
                                    'Done': 'var(--joy-palette-success-softBg)'
                                }
                            }
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
}> = ({
    task,
    fromColumnId,
    moveCard,
    columnName,
    chipCustomize = {
        'To Do': 'primary',
        'In Progress': 'warning',
        'Done': 'success'
    }
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

        return (
            <tr
                ref={(node) => drag(drop(node))}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
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
                    <td>{task.content}</td>
                    <td>
                        <Chip
                            sx={{
                                backgroundColor: chipCustomize[columnName] || 'var(--joy-palette-primary-softBg)'
                            }}
                        >
                            {columnName}
                        </Chip>
                    </td>
                </Sheet>
            </tr >
        );
    };

export default TableView;