import { Button, Sheet } from '@mui/joy';
import React from 'react';

interface ColorPickerPanelProps {
    onChange: (color: string) => void;
    onClose: () => void;
}

const colors = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
];

const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({ onChange, onClose }) => {
    return (
        <Sheet
            sx={{
                display: 'flex',
                gap: '10px',
                marginTop: '10px',
            }}>
            {colors.map((color) => (
                <Button
                    key={color}
                    onClick={() => {
                        onChange(color);
                        onClose();
                    }}
                    sx={{
                        backgroundColor: color,
                        border: 'none',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        borderRadius: '50%',
                    }}
                />
            ))}
        </Sheet>
    );
};

export default ColorPickerPanel;