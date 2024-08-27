import { Box, Input } from "@mui/joy";
import MyMessages from "../MyMessages";
import Header from "../Header";
import Sidebar from "../Sidebar";

export default function ChatsPage() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh', width: '100%' }}>
            <Header />
            <Sidebar />
            <Box component="main" className="MainContent" sx={{ flex: 1 }}>
                <MyMessages />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
                <Input placeholder="Type in here…" variant="outlined" color="primary" size="lg" />
            </Box>
        </Box>
    )
}