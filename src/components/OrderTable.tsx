/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Grid from '@mui/joy/Grid';
import ListItem from '@mui/joy/ListItem';
import List from '@mui/joy/List';
import { AirplanemodeActive, CallToAction, EditNote, FileUpload, MusicNote, TapAndPlay, Timer } from '@mui/icons-material';
import Stack from '@mui/joy/Stack';
import Switch from '@mui/joy/Switch';
import AccordionDetails, { accordionDetailsClasses } from '@mui/joy/AccordionDetails';
import ListItemContent from '@mui/joy/ListItemContent';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';
import Accordion from '@mui/joy/Accordion';
import AccordionGroup from '@mui/joy/AccordionGroup';
import { FormHelperText } from '@mui/joy';


const rows = [
  {
    id: 'INV-1234',
    date: 'Feb 3, 2023',
    status: 'В процессе',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1233',
    date: 'Feb 3, 2023',
    status: 'Выполнено',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1232',
    date: 'Feb 3, 2023',
    status: 'В процессе',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1231',
    date: 'Feb 3, 2023',
    status: 'В процессе',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1230',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1229',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1228',
    date: 'Feb 3, 2023',
    status: 'В процессе',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1227',
    date: 'Feb 3, 2023',
    status: 'Выполнено',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1226',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
  {
    id: 'INV-1225',
    date: 'Feb 3, 2023',
    status: 'Выполнено',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1224',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1223',
    date: 'Feb 3, 2023',
    status: 'Выполнено',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1221',
    date: 'Feb 3, 2023',
    status: 'В процессе',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1220',
    date: 'Feb 3, 2023',
    status: 'Выполнено',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1219',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1218',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1217',
    date: 'Feb 3, 2023',
    status: 'Выполнено',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1216',
    date: 'Feb 3, 2023',
    status: 'Остановлено',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [reaction, setReaction] = React.useState(false);

  const [value, setValue] = React.useState<string[]>([]);
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Статус</FormLabel>
        <Select
          size="sm"
          placeholder="Фильтровать по статусу"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="Выполнено">Выполнено</Option>
          <Option value="pending">В процессе</Option>
          <Option value="В процессе">В процессе</Option>
          <Option value="Остановлено">Остановлено</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Номера</FormLabel>
        <Select size="sm" placeholder="Все">
          <Option value="all">All</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Фильтр
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>

        <Modal open={reaction} onClose={() => { setReaction(false) }} >
          <ModalDialog size='sm' maxWidth='460px'>
            <ModalClose />
            <AccordionGroup
              variant="plain"
              transition="0.2s"
              sx={{
                maxWidth: 400,
                borderRadius: 'md',
                [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
                {
                  paddingBlock: '1rem',
                },
                [`& .${accordionSummaryClasses.button}`]: {
                  paddingBlock: '1rem',
                },
              }}
            >
              <Accordion>
                <AccordionSummary>
                  <Avatar color="primary">
                    <TapAndPlay />
                  </Avatar>
                  <ListItemContent>
                    <Typography level="title-md">База номеров</Typography>
                    <Typography level="body-sm">
                      Выберите номера для вашей компании
                    </Typography>
                  </ListItemContent>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                      <AirplanemodeActive sx={{ mx: 1 }} />
                      <FormLabel>Airplane Mode</FormLabel>
                      <Switch size="sm" />
                    </FormControl>

                    <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                      <AirplanemodeActive sx={{ mx: 1 }} />
                      <FormLabel>Wi-Fi</FormLabel>
                      <Switch size="sm" />
                    </FormControl>

                    <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                      <AirplanemodeActive sx={{ mx: 1 }} />
                      <FormLabel>Bluetooth</FormLabel>
                      <Switch size="sm" />
                    </FormControl>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary>
                  <Avatar color="primary">
                    <EditNote />
                  </Avatar>
                  <ListItemContent>
                    <Typography level="title-md">Лимиты</Typography>
                    <Typography level="body-sm">
                      Установите лимит баланса для вашей компании
                    </Typography>
                  </ListItemContent>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <FormControl orientation="vertical" sx={{ gap: 1 }}>

                      <FormLabel>Лимит (общий)</FormLabel>
                      <Input
                        type="number"
                        defaultValue={2.5}
                        slotProps={{
                          input: {

                            min: 1,
                            max: 5,
                            step: 0.1,
                          },
                        }}
                      />
                    </FormControl>

                    <FormControl orientation="vertical" sx={{ gap: 1 }}>

                      <FormLabel>Лимит на день</FormLabel>
                      <Input
                        type="number"
                        defaultValue={2.5}
                        slotProps={{
                          input: {
                            min: 1,
                            max: 5,
                            step: 0.1,
                          },
                        }}
                      />
                    </FormControl>

                  
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary>
                  <Avatar color="primary">
                    <MusicNote />
                  </Avatar>
                  <ListItemContent>
                    <Typography level="title-md">Аудизоапись</Typography>
                    <Typography level="body-sm">
                      Выберите запись для вашей компании
                    </Typography>
                  </ListItemContent>
                </AccordionSummary>
                <AccordionDetails>
                  <Select defaultValue="dog" startDecorator={<MusicNote />} endDecorator={<Button>Загрузить файл</Button>} indicator=''>
                    <Option value="dog">Dog</Option>
                    <Option value="cat">Cat</Option>
                    <Option value="fish">Fish</Option>
                    <Option value="bird">Bird</Option>
                  </Select>


                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Avatar color="primary">
                    <Timer />
                  </Avatar>
                  <ListItemContent>
                    <Typography level="title-md">Время</Typography>
                    <Typography level="body-sm">
                      Выберите дни недели и время для обзвона
                    </Typography>
                  </ListItemContent>
                </AccordionSummary>
                <AccordionDetails>
                  <Box >
                    <Typography level="body-sm" sx={{ mb: 2 }}>
                      Выбор дней недели
                    </Typography>
                    <List
                      variant="outlined"
                      aria-label="Screens"
                      role="group"
                      orientation="horizontal"
                      sx={{
                        flexGrow: 0,
                        '--List-gap': '8px',
                        '--List-padding': '8px',
                        '--List-radius': '8px',
                        gap: 2,
                        px: 2
                      }}
                    >
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((item) => (
                        <ListItem key={item}>

                          <Checkbox
                            disableIcon
                            overlay
                            label={item}
                            checked={value.includes(item)}
                            color="neutral"
                            variant={value.includes(item) ? 'outlined' : 'plain'}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              if (event.target.checked) {
                                setValue((val) => [...val, item]);
                              } else {
                                setValue((val) => val.filter((text) => text !== item));
                              }
                            }}
                            slotProps={{
                              action: ({ checked }) => ({
                                sx: {
                                  bgcolor: checked ? 'background.level1' : 'transparent',
                                  boxShadow: checked ? 'sm' : 'none',
                                },
                              }),
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Stack
                    direction="row"
                    sx={{ mt: 4 }}
                    alignItems="center"
                    spacing={3}
                  >
                    <FormControl>
                      <Input
                        type="time"
                        slotProps={{
                          input: {
                            min: '09:00',
                            max: '18:00',
                          },
                        }}
                      />
                      <FormHelperText>C</FormHelperText>
                    </FormControl>
                    <FormControl>
                      <Input
                        type="time"
                        slotProps={{
                          input: {
                            min: '09:00',
                            max: '18:00',
                          },
                        }}
                      />
                      <FormHelperText>До </FormHelperText>
                    </FormControl>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Avatar color="primary">
                    <CallToAction />
                  </Avatar>
                  <ListItemContent>
                    <Typography level="title-md">Реакция</Typography>
                    <Typography level="body-sm">
                      Выберите ответную реакцию
                    </Typography>
                  </ListItemContent>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ my: 4 }}>
                    <Grid
                      justifyContent="space-around"
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      sx={{ flexGrow: 1 }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
                        <Grid xs={2} sm={4} md={4} justifyItems="center" key={i}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Button sx={{ maxWidth: '140px' }} variant="outlined" disabled>{i}</Button>
                            <Select size='sm' indicator='' placeholder='Не указан' variant="plain">
                              <Option value="var1">Добавить в список</Option>
                              <Option value="var2">Исключить</Option>
                              <Option value="var3">Бездействовать</Option>
                            </Select>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </AccordionGroup>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Поиск по названию</FormLabel>
          <Input size="sm" placeholder="Поиск" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>Дата</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Статус</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Номера</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, 'id')).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.date}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        'Выполнено': <CheckRoundedIcon />,
                        'В процессе': <AutorenewRoundedIcon />,
                        'Остановлено': <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        'Выполнено': 'success',
                        'В процессе': 'neutral',
                        'Остановлено': 'danger',
                      }[row.status] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

                    <div>
                      <Typography level="body-xs">Список номеров</Typography>
                      <Typography level="body-xs">Случ. число</Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button">
                      Запустить/Остановить
                    </Link>
                    <Dropdown>
                      <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                      >
                        <MoreHorizRoundedIcon />
                      </MenuButton>
                      <Menu size="sm" sx={{ minWidth: 140 }}>
                        <MenuItem onClick={() => { setReaction(true) }}>Редактировать</MenuItem>

                        <Divider />
                        <MenuItem color="danger">Удалить</MenuItem>
                      </Menu>
                    </Dropdown>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Назад
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Далее
        </Button>
      </Box>
    </React.Fragment>
  );
}