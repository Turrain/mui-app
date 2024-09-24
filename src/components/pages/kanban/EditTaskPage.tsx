import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Input, Typography } from '@mui/joy';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import MyMessages from '../../MyMessages';

const EditTaskPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>(); // Получаем ID колонки из параметров
    const [taskContent, setTaskContent] = React.useState('');
    const navigate = useNavigate();

    const handleUpdateTask = () => {
        // Логика для создания задачи, например отправка запроса на сервер
        console.log(`Creating task in column ${taskId}: ${taskContent}`);
        // После создания задачи можно перенаправить назад, например
        // history.push(`/kanban`); // Или перенаправление к родительской странице
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Header />
            <Sidebar />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    px: { xs: 2, md: 6 },
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        sm: 'calc(12px + var(--Header-height))',
                        md: 3,
                    },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100dvh',
                    width: '100%',
                    gap: 1,
                    overflow: 'auto'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        mb: 1,
                        gap: 1,
                        flexDirection: { xs: 'row', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'center' },
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="h2" component="h1">
                        Edit Task
                    </Typography>
                    <Button onClick={() => navigate(-1)}>Back</Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >
                    <Box
                        width={'100%'}
                    >
                        <MyMessages />
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={1}
                        width={'100%'}
                    >
                        <Typography level='h3' pb={2}>Информация</Typography>
                        <Input
                            placeholder="Name"
                            variant="outlined"
                            fullWidth
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                        />
                        <Input
                            placeholder="Company"
                            variant="outlined"
                            fullWidth
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                        />
                        <Input
                            placeholder="Phone"
                            variant="outlined"
                            fullWidth
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                        />
                        <Input
                            placeholder="Comment"
                            variant="outlined"
                            fullWidth
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                        />
                        <Input
                            placeholder="Task"
                            variant="outlined"
                            fullWidth
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                        />
                        <Input
                            placeholder="Datetime"
                            variant="outlined"
                            fullWidth
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                        />
                    </Box>
                </Box>
                <Button onClick={handleUpdateTask} variant="solid" sx={{ mt: 2 }}>
                    Update Task
                </Button>
            </Box>
        </Box>
    );
};

export default EditTaskPage;