import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonIcon from '@mui/icons-material/Person';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import authService from '../utils/api/auth.service';
import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';
import { storesContext } from '../utils/stores';
import { observer } from 'mobx-react';
import DateTimeDisplay from './DateTimeDisplay';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo.png';
import { Button, Card, Stack } from '@mui/joy';

const Sidebar = observer(() => {
  const { userStore } = React.useContext(storesContext);
  const navigate = useNavigate();

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '250px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '270px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {/* <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton> */}
        <img src={logo} height={50} />
        <Typography level="title-lg">Моя компания</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>

      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => navigate('/')}>
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Главная</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => navigate('/')}>
              <PhoneCallbackIcon />
              <ListItemContent>
                <Typography level="title-sm">Dobrozvon U</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => navigate('/virtual-managers')}>
              <PersonIcon />
              <ListItemContent>
                <Typography level="title-sm">Voice Units</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <ListItem>
            {/* <Sheet
              color='warning'
              variant='soft'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                borderRadius: 8,
                width: '100%',
                justifyContent: 'left',
                // alignItems: 'center'
              }}
            >
              <Typography level="body-sm" fontWeight={700}>
                
              </Typography>
            </Sheet> */}
            <Card
              invertedColors
              // variant="soft"
              // color="warning"
              size="sm"
              sx={{ boxShadow: 'none', width: '100%' }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography level="title-sm">Баланс</Typography>
                <Typography level='title-sm'>XXX тнг.</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <PhoneCallbackIcon />
                <Typography level='title-sm'>XXX мин.</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <PersonIcon />
                <Typography level='title-sm'>XXX мин.</Typography>
              </Stack>
              <Button size="sm" variant="solid">
                Пополнить баланс
              </Button>
            </Card>
          </ListItem>
          <ListItem>
            <DateTimeDisplay />
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SupportRoundedIcon />
              Поддержка
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              Настройки
            </ListItemButton>
          </ListItem>
        </List>

      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{userStore.user?.user_data?.email}</Typography>
          <Typography level="body-xs">test</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={() => {
          authService.logout()

        }}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
});

export default Sidebar;