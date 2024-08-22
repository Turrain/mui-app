import { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Header from '../Header';
import Sidebar from '../Sidebar';
import OrderList from '../OrderList';
import { Add } from '@mui/icons-material';
import CreateManagerModal from '../modals/CreateManagerModal';
import Table from '@mui/joy/Table';

interface Manager {
  id: number;
  name: string;
  type: string;
}

export default function VirtualManagerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);

  const handleAddManager = (name: string, type: string) => {
    const newManager: Manager = {
      id: managers.length + 1,
      name,
      type,
    };
    setManagers([...managers, newManager]);
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
          gap: 1,
          overflow: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            mb: 1,
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="h2" component="h1">
            Менеджеры
          </Typography>
          <Button
            color="primary"
            startDecorator={<Add />}
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Добавить менеджера
          </Button>
          <CreateManagerModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreateManager={handleAddManager}
          />
        </Box>
        
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя менеджера</th>
                <th>Тип</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.id}>
                  <td>{manager.id}</td>
                  <td>{manager.name}</td>
                  <td>{manager.type}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
        
        <OrderList />
      </Box>
    </Box>
  );
}