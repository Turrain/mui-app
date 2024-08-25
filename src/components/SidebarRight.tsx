import * as React from 'react';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import { listItemButtonClasses } from '@mui/joy/ListItemButton';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import Button from '@mui/joy/Button';
import { closeSidebar } from '../utils';
// import { storesContext } from '../utils/stores';
import { observer } from 'mobx-react';

const SidebarRight = observer(() => {
//   const { userStore } = React.useContext(storesContext);
  const [filter, setFilter] = React.useState('all');
  const [companyName, setCompanyName] = React.useState('');
  const [businessSphere, setBusinessSphere] = React.useState('');
  const [prompts, setPrompts] = React.useState('');

  return (
    <Sheet
      className="SidebarRight"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: { xs: '280px', lg: '320px' },
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderLeft: '1px solid',
        borderColor: 'divider',
        right: 0,
      }}
    >
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
      
      <Box sx={{ mb: 2 }}>
        <Input
          placeholder="Имя виртуального менеджера"
          sx={{ mb: 2 }}
        />
        <ToggleButtonGroup
          value={filter}
          onChange={(_, newFilter) => setFilter(newFilter || '')}
          // exclusive={true}
          // fullWidth={true}
        >
          <Button value="входящие">Входящие</Button>
          <Button value="исходящие">Исходящие</Button>
          <Button value="all">Все</Button>
        </ToggleButtonGroup>
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
          <ListItem></ListItem>
          <ListItem></ListItem>
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
          <ListItem></ListItem>
          <ListItem></ListItem>
        </List>
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ my: 2 }} />
        <Input
          placeholder="Название фирмы"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Input
          placeholder="Сфера деятельности"
          value={businessSphere}
          onChange={(e) => setBusinessSphere(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Textarea
          placeholder="Промпты"
          minRows={3}
          value={prompts}
          onChange={(e) => setPrompts(e.target.value)}
        />
      </Box>
    </Sheet>
  );
});

export default SidebarRight;