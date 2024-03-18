import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';



interface NumberStateModalProps {
    open: boolean;
    onClose: () => void;
}

const NumberStateModal: React.FC<NumberStateModalProps> = ({ open, onClose }) => {
  
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <Typography level="h4" component="h2">Выберите состояние для цифры</Typography>
                <Table>
                    <thead>
                        <tr>
                            <th>Цифра</th>
                            <th>Состояние</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
                            <tr key={number}>
                                <td>{number}</td>
                                <td>
                                    <Select
                                        size="sm"
                                        defaultValue=""
                                    >
                                        <Option value="">Выберите состояние</Option>
                                        <Option value="active">Активно</Option>
                                        <Option value="inactive">Неактивно</Option>
                                        <Option value="pending">В ожидании</Option>
                                    </Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ModalDialog>
        </Modal>
    );
};

export default NumberStateModal;