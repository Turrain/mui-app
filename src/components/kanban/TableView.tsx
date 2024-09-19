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
                gap: '20px'
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
                    backgroundColor: isOver ? 'lightgray' : 'transparent',
                    p: '10px',
                    cursor: 'pointer',
                }}
            >
                {column.title}
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {column.tasks.map((task) => (
                        <DraggableTask key={task.id} task={task} fromColumnId={column.id} moveCard={moveCard} columnName={column.title} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DraggableTask: React.FC<{ task: Task; fromColumnId: string; moveCard: (fromColumnId: string, toColumnId: string, taskId: string) => void; columnName: string }> = ({ task, fromColumnId, moveCard, columnName }) => {
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
                        // startDecorator={
                        //     {
                        //         'To Do': <AutorenewRounded />,
                        //         'In Progress': <Block />,
                        //     }[columnName]
                        // }
                        color={
                            {
                                'To Do': 'primary',
                                'In Progress': 'warning',
                                'Done': 'success'
                            }[columnName] as ColorPaletteProp
                        }
                    >
                        {columnName}
                    </Chip>
                </td>
            </Sheet>
        </tr >
    );
};

export default TableView;