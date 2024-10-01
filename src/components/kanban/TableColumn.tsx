import { Typography } from "@mui/joy";
import { useState } from "react";
import { useDrop } from "react-dnd";
import TableTask from "./TableTask";
import useKanbanStore from "../../utils/stores/KanbanStore";

interface TableColumnProps {
    id: number;
    title: string;
    tagColor: string;
    tasks: Task[];
}

const TableColumn: React.FC<TableColumnProps> = ({ id, title, tasks, tagColor }) => {
    const [chipColor, setChipColor] = useState({ [title]: tagColor });
    const moveTask = useKanbanStore(state => state.moveTask);

    const [, drop] = useDrop({
        accept: 'TASK',
        hover: (item: { fromColumnId: number, index: number }) => {
            if (item.fromColumnId !== id) {
                moveTask(item.fromColumnId, id, item.index, tasks.length);
                item.fromColumnId = id;
                item.index = tasks.length - 1;
            }
        }
    });

    return (
        <div
            ref={drop}
        >
            <Typography
                level='title-lg'
                sx={{
                    p: '10px',
                    cursor: 'pointer',
                }}
            >
                {title} | {tasks.length}
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {tasks.map((task, index) => (
                        <TableTask
                            key={`drag-task-${index}`}
                            task={task}
                            index={index}
                            fromColumnId={id}
                            moveTask={moveTask}
                            columnName={title}
                            chipCustomize={chipColor}
                            setChipColor={setChipColor}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableColumn;