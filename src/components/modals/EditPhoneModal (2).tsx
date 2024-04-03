import React from 'react';
import { Modal, ModalDialog, ModalClose, Sheet, Button, FormControl, FormLabel, Input, ListItemContent, Typography, List, ListItem, Stack, IconButton, ListDivider } from '@mui/joy';
import { Create, Delete, Close, Done } from '@mui/icons-material';
import { IMaskInput } from 'react-imask';
import { observer } from 'mobx-react';
import { storesContext } from '../../utils/stores';

interface EditPhoneModalProps {
    open: boolean;
    index: number;
    onClose: () => void;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskAdapter = React.forwardRef<HTMLElement, CustomProps>(
    function TextMaskAdapter(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask={'# (000) 000 0000'}
                definitions={{ '#': /[1-9]/, }}
                ref={ref}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        )
    }
)

const EditPhoneModal: React.FC<EditPhoneModalProps> = observer(({ open, onClose, index }) => {
    const [phonesList, setPhonesList] = React.useState<string[]>([]);
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [phoneBase, setPhoneBase] = React.useState<string>('');
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [editPhone, setEditPhone] = React.useState<string>('');

    const { phoneListStore } = React.useContext(storesContext);

    React.useEffect(() => {
        setPhoneBase(phoneListStore.orders[index].name);
        setPhonesList(phoneListStore.orders[index].phones);
    }, []);

    const handleSubmit = () => {
        phoneListStore.updateOrder(phoneListStore.orders[index].id, {
            phones: phonesList,
            name: phoneBase
        });
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
        if(phoneNumber.length == 16) {
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
    };

    const handleEditCancelClick = () => {
        setEditIndex(null);
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditPhone(event.target.value);
    };

    return (
        <Modal open={open} onClose={() => onClose()} >
            <ModalDialog size='md' maxWidth='460px'>
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
                <Sheet
                    variant='outlined'
                    sx={{
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        borderRadius: 'sm'
                    }}
                >
                    <List sx={{ maxWidth: 250 }}>
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