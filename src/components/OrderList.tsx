/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useAuth } from '../App';
type Reaction = {
  [key: string]: string;
};

type DataOrder = {
  name: string;
  com_limit: number;
  day_limit: number;
  sound_file_id: number;
  status: number;
  start_time: string;
  end_time: string;
  reaction: Reaction;
  phones_id: number;
  id: string;
};


type DataOrders = DataOrder[];

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Реактировать</MenuItem>
        <Divider />
        <MenuItem color="danger">Удалить</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OrderList() {
  const [orders, setOrders] = React.useState<DataOrders>([]);
  const auth = useAuth();
  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/companies', {
      headers: {
        'Authorization': `Bearer ${auth.user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data: DataOrders) => setOrders(data))
      .catch((error) => console.error('Ошибка при получении данных:', error));
  }, [])

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {orders.map((listItem) => (
        <List
          key={listItem.id}
          size="sm"
          sx={{
            
            '--ListItem-paddingX': 0,
          }}
        >
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
          
              <div>
                <Typography fontWeight={600} gutterBottom>
                  {listItem.name}
                </Typography>
                <Typography level="body-xs" gutterBottom>
                  <Link>
                    Прослушать запись
                  </Link>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography level="body-xs">{listItem.start_time}</Typography>
                  <Typography level="body-xs">&bull;</Typography>
                  <Typography level="body-xs">{listItem.end_time}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Link level="body-sm" component="button">
                    Запустить/Остановить
                  </Link>
                  <RowMenu />
                </Box>
              </div>
            </ListItemContent>
            <Chip
                        variant="soft"
                        size="sm"
                        startDecorator={
                          {
                            '1': <AutorenewRoundedIcon />,
                            '0': <BlockIcon />,
                          }[listItem.status]
                        }
                        color={
                          {
                            '1': 'success',
                            '0': 'danger',
                          }[listItem.status] as ColorPaletteProp
                        }
                      >
                        {{
                          '1': 'В процессе',
                          '0': 'Остановлен',
                        }[listItem.status]}
                      </Chip>
          </ListItem>
          <ListDivider />
        </List>
      ))}
      <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" mx="auto">
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}