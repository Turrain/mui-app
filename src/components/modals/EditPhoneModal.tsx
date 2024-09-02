import React from 'react';
import { Modal, ModalDialog, ModalClose, Sheet, Button, FormControl, FormLabel, Input, ListItemContent, Typography, List, ListItem, Stack, IconButton, ListDivider, Tab, tabClasses, TabList, TabPanel, Tabs } from '@mui/joy';
import { Create, Delete, Close, Done } from '@mui/icons-material';
import { IMaskInput } from 'react-imask';
import { usePhoneListStore } from '../../utils/stores/PhoneListStore';
import * as XLSX from 'xlsx';

interface EditPhoneModalProps {
    id: number;
    open: boolean;
    onClose: () => void;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskAdapter = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskAdapter(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask={'# (000) 000 0000'}
                definitions={{ '#': /[1-9]/, }}
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        )
    }
)

const EditPhoneModal: React.FC<EditPhoneModalProps> = (({ id, open, onClose }) => {
    const [phonesList, setPhonesList] = React.useState<string[]>([]);
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [phoneBase, setPhoneBase] = React.useState<string>('');
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [editPhone, setEditPhone] = React.useState<string>('');
    const [copyPasteData, setCopyPasteData] = React.useState<string>('');
    const [selectedFile, setSelectedFile] = React.useState<string>('');

    const phoneListStore = usePhoneListStore();

    React.useEffect(() => {
        const data = phoneListStore.getPhonesListById(id);
        if (data) {
            setPhoneBase(data.name);
            setPhonesList(data.phones);
        }
    }, [id]);

    const handleSubmit = () => {
        phoneListStore.updatePhonesList(id, {
            phones: phonesList,
            name: phoneBase
        });
        setSelectedFile('');
        onClose(); // Закрыть модальное окно после отправки формы
    };

    const handleDeletePhone = (index: number) => {
        setPhonesList(prevList => {
            const updatedList = [...prevList];
            updatedList.splice(index, 1);
            return updatedList;
        });
    };

    const handleAddPhone = (phone: string) => {
        if (phoneNumber.length == 16) {
            setPhonesList(prevList => [...prevList, phone]);
            setPhoneNumber('');
        }
    };

    const handleEditClick = (index: number) => {
        setEditIndex(index);
        setEditPhone(phonesList[index]);
    };

    const handleEditApplyClick = (index: number) => {
        setPhonesList(prevList => {
            const updatedList = [...prevList];
            updatedList[index] = editPhone;
            return updatedList;
        });
        setEditIndex(null);
        setSelectedFile('');
    };

    const handleEditCancelClick = () => {
        setEditIndex(null);
        setSelectedFile('');
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditPhone(event.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const phoneNumbers = XLSX.utils.sheet_to_json<object[]>(worksheet, { header: "A" });

                const extractedPhones = phoneNumbers.flat().map((phone: any) => phone['A'].toString());

                console.log(extractedPhones);

                setPhonesList(prevList => [...prevList, ...extractedPhones]);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const text = event.clipboardData.getData('text');
        const rows = text.split('\n').map(row => row.trim()).filter(row => row);
        setPhonesList(prevList => [...prevList, ...rows]);
    };

    return (
        <Modal open={open} onClose={() => onClose()} >
            <ModalDialog
                size='md'
                maxWidth='460px'
                minWidth='400px'
                sx={{
                    height: '100%'
                }}
            >
                <ModalClose />
                <FormControl>
                    <FormLabel>Название списка номеров</FormLabel>
                    <Input
                        value={phoneBase}
                        onChange={(event) => setPhoneBase(event.target.value)}
                        placeholder="Название"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Номер</FormLabel>
                    <Input
                        type='tel'
                        slotProps={{ input: { component: TextMaskAdapter } }}
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="7 (777) 777 7777"
                    />
                </FormControl>
                <FormControl>
                    <Button onClick={() => handleAddPhone(phoneNumber)}>
                        Добавить номер
                    </Button>
                </FormControl>
                <Tabs
                    defaultValue={0}
                    sx={{
                        bgcolor: 'transparent',
                    }}
                >
                    <TabList
                        disableUnderline
                        sx={{
                            flexDirection: { xs: 'column', sm: 'row' },
                            p: 0.5,
                            gap: 0.5,
                            borderRadius: 6,
                            bgcolor: 'var(--joy-palette-background-level2)',
                            [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                bgcolor: 'background.surface',
                                borderRadius: 6,
                            },
                        }}
                    >
                        <Tab disableIndicator>
                            <Typography level='body-sm' sx={{ color: 'var(--joy-palette-text-secondary)' }}>Загрузить из Excel</Typography>
                        </Tab>
                        <Tab disableIndicator>
                            <Typography level='body-sm' sx={{ color: 'var(--joy-palette-text-secondary)' }}>Вставить номера из таблиц</Typography>
                        </Tab>
                    </TabList>
                    <TabPanel
                        value={0}
                        sx={{
                            px: 0,
                        }}
                    >
                        <FormControl>
                            {/* <FormLabel>Загрузить из Excel</FormLabel> */}
                            <input
                                type='file'
                                id='excelFileInput'
                                style={{ display: 'none' }}
                                accept='.xlsx, .xls'
                                onChange={handleFileChange}
                            />
                            <Input
                                value={selectedFile}
                                endDecorator={
                                    <Button
                                        onClick={() => {
                                            document.getElementById('excelFileInput')?.click();
                                        }}
                                    >
                                        Загрузить файл
                                    </Button>
                                }
                                sx={{
                                    alignItems: 'center',
                                }}
                            />
                        </FormControl>
                    </TabPanel>
                    <TabPanel
                        value={1}
                        sx={{
                            px: 0,
                        }}
                    >
                        <FormControl>
                            {/* <FormLabel>Вставить номера из таблиц</FormLabel> */}
                            <textarea
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
                                    padding: '8px',
                                    borderRadius: 6,
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    resize: 'none',
                                    backgroundColor: 'var(--joy-palette-background-surface)',
                                    display: 'block',
                                }}
                                onPaste={handlePaste}
                                onChange={(e) => setCopyPasteData(e.target.value)}
                                value={copyPasteData}
                                placeholder="Вставьте скопированные номера сюда"
                            />
                        </FormControl>
                    </TabPanel>
                </Tabs>
                <Sheet
                    variant='outlined'
                    sx={{
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        borderRadius: 'sm'
                    }}
                >
                    <List>
                        {
                            phonesList.length > 0 ? (
                                phonesList.map((item, index) => (
                                    <Stack key={index}>
                                        <ListItem endAction={
                                            editIndex === index ? (
                                                <Stack direction={'row'}>
                                                    <IconButton
                                                        aria-label="Apply"
                                                        size="sm"
                                                        variant="plain"
                                                        color="success"
                                                        onClick={() => { handleEditApplyClick(index) }}
                                                    >
                                                        <Done />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="Cancel"
                                                        size="sm"
                                                        variant="plain"
                                                        color="danger"
                                                        onClick={() => handleEditCancelClick()}
                                                    >
                                                        <Close />
                                                    </IconButton>
                                                </Stack>
                                            ) : (
                                                <Stack direction={'row'}>
                                                    <IconButton
                                                        aria-label="Edit"
                                                        size="sm"
                                                        variant="plain"
                                                        color="success"
                                                        onClick={() => { handleEditClick(index) }}
                                                    >
                                                        <Create />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="Delete"
                                                        size="sm"
                                                        variant="plain"
                                                        color="danger"
                                                        onClick={() => handleDeletePhone(index)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Stack>
                                            )
                                        }>
                                            {editIndex === index ? (
                                                <Input
                                                    sx={{ "--Input-focusedThickness": "0px" }}
                                                    variant='plain'
                                                    value={editPhone}
                                                    onChange={handleEditInputChange}
                                                    placeholder="7 (777) 777 7777"
                                                    type='tel'
                                                    slotProps={{ input: { component: TextMaskAdapter } }}
                                                />
                                            ) : (
                                                <Typography>
                                                    {item}
                                                </Typography>
                                            )}
                                        </ListItem>
                                        {phonesList.length !== 1 && <ListDivider inset={'gutter'} />}
                                    </Stack>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemContent>
                                        <Typography level='title-sm' textAlign={'center'}>Пусто</Typography>
                                    </ListItemContent>
                                </ListItem>
                            )}
                    </List>
                </Sheet>
                <Button onClick={handleSubmit}>Изменить</Button>
            </ModalDialog>
        </Modal>
    );
})

export default EditPhoneModal;