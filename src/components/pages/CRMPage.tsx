
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Typography, Box } from '@mui/joy';
import Board from '../kanban/Board';
import Calendar from '../Calendar';
import Scheduler from '../calendar/Scheduler';

export default function CRMPage() {

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
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'start', sm: 'center' },
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography level="h3" component="h1">
                            CRM
                        </Typography>
                    </Box>
                    {/* <Board /> */}
                    {/* <Calendar /> */}
                    <Scheduler />
                </Box>
        </Box>
    );
}