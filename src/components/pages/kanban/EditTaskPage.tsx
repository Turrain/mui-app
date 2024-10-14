import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Input, Typography } from '@mui/joy';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import MyMessages from '../../MyMessages';
import { storesContext } from '../../../utils/stores';

const EditTaskPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const { useKanbanStore } = useContext(storesContext);
    const { getTaskById, updateTask } = useKanbanStore();

    const [formData, setFormData] = React.useState(getTaskById(Number(taskId)));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData!,
            [e.target.name]: e.target.value
        });
    }

    const handleUpdateTask = () => {
        updateTask(formData!, Number(taskId));
        navigate(-1);
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
                            name="name"
                            variant="outlined"
                            fullWidth
                            value={formData?.name}
                            onChange={handleInputChange}
                        />
                        <Input
                            placeholder="Company"
                            name="company"
                            variant="outlined"
                            fullWidth
                            value={formData?.company}
                            onChange={handleInputChange}
                        />
                        <Input
                            placeholder="Phone"
                            name="phone"
                            variant="outlined"
                            fullWidth
                            value={formData?.phone}
                            onChange={handleInputChange}
                        />
                        <Input
                            placeholder="Comment"
                            name="comment"
                            variant="outlined"
                            fullWidth
                            value={formData?.comment}
                            onChange={handleInputChange}
                        />
                        <Input
                            placeholder="Task"
                            name="task"
                            variant="outlined"
                            fullWidth
                            value={formData?.task}
                            onChange={handleInputChange}
                        />
                        <Input
                            placeholder="Datetime"
                            name="datetime"
                            variant="outlined"
                            fullWidth
                            type="datetime-local"
                            value={formData?.datetime.toString()}
                            onChange={handleInputChange}
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