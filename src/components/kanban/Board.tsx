import React from 'react';
import Column from './Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Grid } from '@mui/joy';
import useKanbanStore from '../../utils/stores/KanbanStore';

const Board: React.FC = () => {
    const columns = useKanbanStore(state => state.columns);
    const moveCard = useKanbanStore(state => state.moveCard);

    return (
        <DndProvider backend={HTML5Backend}>
            <Grid container spacing={2} style={{ display: 'flex', gap: '16px' }}>
                {columns.map((column) => (
                    <Column key={column.id} id={column.id} title={column.title} tasks={column.tasks} moveCard={moveCard} />
                ))}
            </Grid>
        </DndProvider>
    );
};

export default Board;