import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Input, Select, Option, styled, Typography } from '@mui/joy';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import MyMessages from '../../MyMessages';
import { storesContext } from '../../../utils/stores';

const StyledInput = styled('input')({
    border: 'none', // remove the native input border
    minWidth: 0, // remove the native input width
    outline: 0, // remove the native input outline
    padding: 0, // remove the native input padding
    paddingTop: '1em',
    flex: 1,
    color: 'inherit',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    textOverflow: 'ellipsis',
    '&::placeholder': {
        opacity: 0,
        transition: '0.1s ease-out',
    },
    '&:focus::placeholder': {
        opacity: 1,
    },
    '&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label': {
        top: '0.5rem',
        fontSize: '0.75rem',
    },
    '&:focus ~ label': {
        color: 'var(--Input-focusedHighlight)',
    },
    '&:-webkit-autofill': {
        alignSelf: 'stretch', // to fill the height of the root slot
    },
    '&:-webkit-autofill:not(* + &)': {
        marginInlineStart: 'calc(-1 * var(--Input-paddingInline))',
        paddingInlineStart: 'var(--Input-paddingInline)',
        borderTopLeftRadius:
            'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
        borderBottomLeftRadius:
            'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
    },
});

const StyledLabel = styled('label')(({ theme }) => ({
    position: 'absolute',
    lineHeight: 1,
    top: 'calc((var(--Input-minHeight) - 1em) / 2)',
    color: theme.vars.palette.text.tertiary,
    fontWeight: theme.vars.fontWeight.md,
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InnerInput = React.forwardRef<
    HTMLInputElement,
    React.JSX.IntrinsicElements['input']
>(function InnerInput(props, ref) {
    const id = React.useId();
    return (
        <React.Fragment>
            <StyledInput {...props} ref={ref} id={id} />
            <StyledLabel htmlFor={id}>{props.placeholder}</StyledLabel>
        </React.Fragment>
    );
});

const EditTaskPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const { useKanbanStore } = useContext(storesContext);
    const { fetchTaskById, updateTask, columns } = useKanbanStore();

    const [formData, setFormData] = useState<Task>();
    
    useEffect(() => {
        fetchTaskById(Number(taskId)).then(res => setFormData(res[0]));
    }, [fetchTaskById]);
    console.log(formData!);
    
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

    const handleColumnChange = (e: any, value: number | null) => {
        setFormData({
            ...formData!,
            column_id: value!,
        })
    }

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
                            slots={{
                                input: InnerInput
                            }}
                            slotProps={{
                                input: {
                                    placeholder: "Name",
                                    name: "name",
                                    variant: "outlined",
                                    fullWidth: true,
                                    value: formData?.name,
                                    onChange: handleInputChange
                                }
                            }}
                            sx={{
                                '--Input-minHeight': '56px',
                                '--Input-radius': '6px',
                            }}
                        />
                        <Input
                            slots={{
                                input: InnerInput
                            }}
                            slotProps={{
                                input: {
                                    placeholder: "Company",
                                    name: "company",
                                    variant: "outlined",
                                    fullWidth: true,
                                    value: formData?.company,
                                    onChange: handleInputChange
                                }
                            }}
                            sx={{
                                '--Input-minHeight': '56px',
                                '--Input-radius': '6px',
                            }}
                        />
                        <Input
                            slots={{
                                input: InnerInput
                            }}
                            slotProps={{
                                input: {
                                    placeholder: "Phone",
                                    name: "phone",
                                    variant: "outlined",
                                    fullWidth: true,
                                    value: formData?.phone,
                                    onChange: handleInputChange
                                }
                            }}
                            sx={{
                                '--Input-minHeight': '56px',
                                '--Input-radius': '6px',
                            }}
                        />
                        <Input
                            slots={{
                                input: InnerInput
                            }}
                            slotProps={{
                                input: {
                                    placeholder: "Comment",
                                    name: "comment",
                                    variant: "outlined",
                                    fullWidth: true,
                                    value: formData?.comment,
                                    onChange: handleInputChange
                                }
                            }}
                            sx={{
                                '--Input-minHeight': '56px',
                                '--Input-radius': '6px',
                            }}
                        />
                        <Input
                            slots={{
                                input: InnerInput
                            }}
                            slotProps={{
                                input: {
                                    placeholder: "Task",
                                    name: "task",
                                    variant: "outlined",
                                    fullWidth: true,
                                    value: formData?.task,
                                    onChange: handleInputChange
                                }
                            }}
                            sx={{
                                '--Input-minHeight': '56px',
                                '--Input-radius': '6px',
                            }}
                        />
                        <Select
                            value={formData?.column_id}
                            onChange={handleColumnChange}
                            variant='outlined'
                        >
                            {columns.map((column, index) => (
                                <Option
                                    key={index}
                                    value={column.id}
                                >
                                    {column.title}
                                </Option>
                            ))}
                        </Select>
                        <Input
                            placeholder="Datetime"
                            name="datetime"
                            variant="outlined"
                            fullWidth
                            type="datetime-local"
                            value={formData?.datetime?.toString()}
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