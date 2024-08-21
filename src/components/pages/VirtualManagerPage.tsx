import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Header from '../Header';
import Sidebar from '../Sidebar';
import SidebarRight from '../SidebarRight';
import OrderList from '../OrderList';
import { Add } from '@mui/icons-material';

export default function DashboardPage() {
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
            >
              Добавить менеджера
            </Button>
          </Box>
          <OrderList />
        </Box>
        <SidebarRight />
      </Box>
  );
}