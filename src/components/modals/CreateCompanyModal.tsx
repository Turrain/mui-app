
import React, { useState } from 'react';
import { Modal, ModalDialog, ModalClose, Sheet, Button, FormControl, Option, FormLabel, Input, AccordionGroup, accordionDetailsClasses, accordionSummaryClasses, Accordion, AccordionSummary, Avatar, ListItemContent, Typography, AccordionDetails, List, ListItem, ListSubheader, ListItemButton, Stack, Select, Checkbox, Box, FormHelperText, Grid, Tooltip, Divider, Chip, ListDivider, IconButton } from '@mui/joy';
import { CallToAction, Create, Delete, EditNote, MusicNote, PhoneAndroid, TapAndPlay, Timer } from '@mui/icons-material';
import RecordingsList, { AudioRecorder, UseRecorder, useRecorder } from '../AudioRecorder';
import { storesContext } from '../../utils/stores';
import { observer } from 'mobx-react';
import CreatePhoneModal from './CreatePhoneModal';
import EditPhoneModal from './EditPhoneModal';

interface CreateCompanyModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = observer(({ open, onClose }) => {
    const [companyName, setCompanyName] = useState<string>('');
    const [companyLimit, setCompanyLimit] = useState<string>('90');
    const [dailyLimit, setDailyLimit] = useState<string>('9');
    const [soundFile, setSoundFile] = useState<number>(0);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [reaction, setReaction] = useState<Reaction>({});
    const [phoneList, setPhoneList] = React.useState<number>();
    const [days, setDays] = React.useState<number[]>([]);
    const { recorderState, ...handlers }: UseRecorder = useRecorder();
    const { audio } = recorderState;

    const { companyStore, soundfileStore, phoneListStore } = React.useContext(storesContext);

    const [createPhoneModalOpen, setCreatePhoneModalOpen] = React.useState<boolean>(false);
    const [editPhoneModalOpen, setEditPhoneModalOpen] = React.useState<boolean>(false);

    const [editPhoneModalIndex, setEditPhoneModalIndex] = React.useState<number>(0);
    const handleDeletePhoneList = (index: number) => {
        phoneListStore.deleteOrder(phoneListStore.orders[index].id);
    }


    const handleSubmit = () => {
        companyStore.createOrder({
            name: companyName,
            com_limit: parseInt(companyLimit, 10),
            day_limit: parseInt(dailyLimit, 10),
            sound_file_id: soundFile,
            status: 0,
            days: days,
            start_time: "09:40:55.446Z", // TODO: parsing 
            end_time: "09:40:55.446Z",
            reaction: reaction,
            phones_id: phoneList
        })

        onClose(); // Закрыть модальное окно после отправки формы
    };

    return (
        <Modal open={open} onClose={() => onClose()} >
            <ModalDialog size='sm' maxWidth='460px'>
                <ModalClose />
                <FormControl>
                    <FormLabel>Название компании</FormLabel>
                    <Input
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        placeholder="Название"
                    />
                </FormControl>
                <AccordionGroup
                    variant="plain"
                    transition="0.2s"
                    sx={{
                        overflow: 'auto',
                        maxWidth: 400,
                        borderRadius: 'md',
                        [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
                        {
                            paddingBlock: '1rem',
                        },
                        [`& .${accordionSummaryClasses.button}`]: {
                            paddingBlock: '1rem',
                        },
                    }}
                >
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <TapAndPlay />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-md">База номеров</Typography>
                                <Typography level="body-sm">
                                    Выберите номера для вашей компании
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Sheet
                                variant="outlined"
                                sx={{
                                    maxHeight: 300,
                                    overflow: 'auto',
                                    borderRadius: 'sm',
                                }}
                            >
                                <List>
                                    <ListItem nested >
                                        <ListSubheader sticky>
                                            <Button size="sm" sx={{ width: '100%' }} onClick={() => setCreatePhoneModalOpen(true)}>
                                                Добавить базу номеров
                                            </Button>
                                        </ListSubheader>
                                        <List>
                                            {
                                                phoneListStore.orders.length > 0 ? (
                                                    phoneListStore.orders.map((item, index) => (
                                                        <Stack key={index}>
                                                            <ListItem endAction={
                                                                <Stack direction={'row'}>
                                                                    <IconButton
                                                                        aria-label="Edit"
                                                                        size="sm"
                                                                        variant="plain"
                                                                        color="success"
                                                                        onClick={() => {
                                                                            setEditPhoneModalOpen(true);
                                                                            setEditPhoneModalIndex(item.id)
                                                                        }}
                                                                    >
                                                                        <Create />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        aria-label="Delete"
                                                                        size="sm"
                                                                        variant="plain"
                                                                        color="danger"
                                                                        onClick={() => { handleDeletePhoneList(index) }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Stack>
                                                            }>
                                                                <Tooltip title={
                                                                    <Box sx={{ p: 1 }}>
                                                                        {item.phones.slice(0, 5).map((phone, phoneIndex) => (
                                                                            <Box key={phoneIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <PhoneAndroid color="primary" />
                                                                                <Typography fontWeight="lg" fontSize="sm" sx={{ color: 'text.secondary' }}>
                                                                                    {phone}
                                                                                </Typography>
                                                                            </Box>
                                                                        ))}
                                                                    </Box>
                                                                }
                                                                    placement="right"
                                                                    variant="outlined"
                                                                    arrow
                                                                >
                                                                    <ListItemButton
                                                                        color={phoneList == item.id ? "success" : "neutral"}
                                                                        onClick={() => {
                                                                            setPhoneList(item.id)
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                    </ListItemButton>
                                                                </Tooltip>
                                                            </ListItem>
                                                            {phoneListStore.orders.length !== 1 && <ListDivider inset={'gutter'} />}
                                                        </Stack>
                                                    ))
                                                ) : (
                                                    <ListItem>
                                                        <ListItemContent>
                                                            <Typography level='title-sm' textAlign={'center'}>Пусто</Typography>
                                                        </ListItemContent>
                                                    </ListItem>
                                                )
                                            }
                                        </List>
                                    </ListItem>
                                </List>
                            </Sheet>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <EditNote />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-md">Лимиты</Typography>
                                <Typography level="body-sm">
                                    Установите лимит баланса для вашей компании
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1.5}>
                                <FormControl orientation="vertical" sx={{ gap: 1 }}>
                                    <FormLabel>Лимит (общий)</FormLabel>
                                    <Input
                                        value={companyLimit}
                                        onChange={(e) => setCompanyLimit(e.target.value)}
                                        type="number"
                                        defaultValue={2.5}
                                        slotProps={{
                                            input: {

                                                min: 1,
                                                max: 5,
                                                step: 0.1,
                                            },
                                        }}
                                    />
                                </FormControl>

                                <FormControl orientation="vertical" sx={{ gap: 1 }}>

                                    <FormLabel>Лимит на день</FormLabel>
                                    <Input
                                        value={dailyLimit}
                                        onChange={(e) => setDailyLimit(e.target.value)}
                                        type="number"
                                        defaultValue={2.5}
                                        slotProps={{
                                            input: {
                                                min: 1,
                                                max: 5,
                                                step: 0.1,
                                            },
                                        }}
                                    />
                                </FormControl>


                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <MusicNote />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-md">Аудизоапись</Typography>
                                <Typography level="body-sm">
                                    Выберите запись для вашей компании
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <input
                                type="file"
                                id="audioFileInput"
                                style={{ display: 'none' }}
                                accept="audio/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        soundfileStore.createOrderFromFile(file);
                                    }
                                }}
                            />
                            <Select
                                value={soundFile}
                                onChange={(_, nv) => { if (nv !== null) setSoundFile(nv) }}
                                startDecorator={<MusicNote />}
                                endDecorator={
                                    <Button
                                        onClick={() => {
                                            document.getElementById('audioFileInput')?.click();
                                        }}
                                    >
                                        Загрузить файл
                                    </Button>
                                }
                                indicator=''
                            >
                                {soundfileStore.orders.map((file) => (
                                    <Option key={file.id} value={file.id}>
                                        <Box
                                            sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}
                                        >
                                            <Typography
                                                sx={{
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    width: '75%'
                                                }}
                                            >
                                                {file.name}
                                            </Typography>
                                            <IconButton
                                                color='danger'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    soundfileStore.deleteOrder(file.id);
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Option>
                                ))}
                            </Select>
                            <Divider>
                                <Chip sx={{ my: 2 }} variant="soft" color="neutral" size="sm">
                                    Звукозапись
                                </Chip>
                            </Divider>


                            <AudioRecorder recorderState={recorderState} handlers={handlers} />
                            <RecordingsList audio={audio} />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <Timer />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-md">Время</Typography>
                                <Typography level="body-sm">
                                    Выберите дни недели и время для обзвона
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box >
                                <Typography level="body-sm" sx={{ mb: 2 }}>
                                    Выбор дней недели
                                </Typography>
                                <List
                                    variant="outlined"
                                    aria-label="Screens"
                                    role="group"
                                    orientation="horizontal"
                                    sx={{
                                        flexGrow: 0,
                                        '--List-gap': '8px',
                                        '--List-padding': '8px',
                                        '--List-radius': '8px',
                                        gap: 2,
                                        px: 2
                                    }}
                                >
                                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((item, index) => (
                                        <ListItem key={item}>
                                            <Checkbox
                                                disableIcon
                                                overlay
                                                label={item}
                                                checked={days.includes(index)}
                                                color="neutral"
                                                variant={days.includes(index) ? 'outlined' : 'plain'}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (event.target.checked) {
                                                        setDays((val) => [...val, index]);

                                                    } else {
                                                        setDays((val) => val.filter((text) => text !== index));
                                                    }
                                                }}
                                                slotProps={{
                                                    action: ({ checked }) => ({
                                                        sx: {
                                                            bgcolor: checked ? 'background.level1' : 'transparent',
                                                            boxShadow: checked ? 'sm' : 'none',
                                                        },
                                                    }),
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                            <Stack
                                direction="row"
                                sx={{ mt: 4 }}
                                alignItems="center"
                                spacing={3}
                            >
                                <FormControl>
                                    <Input
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        type="time"
                                        slotProps={{
                                            input: {
                                                min: '09:00',
                                                max: '18:00',
                                            },
                                        }}
                                    />
                                    <FormHelperText>C</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <Input
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        type="time"
                                        slotProps={{
                                            input: {
                                                min: '09:00',
                                                max: '18:00',
                                            },
                                        }}
                                    />
                                    <FormHelperText>До </FormHelperText>
                                </FormControl>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <CallToAction />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-md">Реакция</Typography>
                                <Typography level="body-sm">
                                    Выберите ответную реакцию
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ my: 4 }}>
                                <Grid
                                    justifyContent="space-around"
                                    container
                                    spacing={{ xs: 2, md: 3 }}
                                    columns={{ xs: 4, sm: 8, md: 12 }}
                                    sx={{ flexGrow: 1 }}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
                                        <Grid xs={2} sm={4} md={4} justifyItems="center" key={i}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                <Button sx={{ maxWidth: '140px' }} variant="outlined" disabled>{i}</Button>
                                                <Select
                                                    size='sm'
                                                    indicator=''
                                                    placeholder='Не указан'
                                                    variant="plain"
                                                    onChange={(_, nv) => { setReaction({ ...reaction, [i]: nv }); console.log(reaction); }}
                                                >
                                                    <Option value="yes">Добавить в список</Option>
                                                    <Option value="maybe">Исключить</Option>
                                                    <Option value="no">Бездействовать</Option>
                                                </Select>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
                <CreatePhoneModal open={createPhoneModalOpen} onClose={() => setCreatePhoneModalOpen(false)} />
                <EditPhoneModal open={editPhoneModalOpen} onClose={() => setEditPhoneModalOpen(false)} id={editPhoneModalIndex} />
                <Button onClick={handleSubmit}>Создать</Button>
            </ModalDialog>
        </Modal>
    );
})

export default CreateCompanyModal;
