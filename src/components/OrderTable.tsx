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
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
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
import { FormHelperText, ListItemButton, ListSubheader } from '@mui/joy';
import EditCompanyModal from './modals/EditCompanyModal';
import DeleteCompanyModal from './modals/DeleteCompanyModal';
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

interface HeadCell {
  disablePadding: boolean;
  id: keyof DataOrder;
  label: string;
  numeric: boolean;
}

type DataOrders = DataOrder[];


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
  a: { [key in Key]: number | string | Reaction },
  b: { [key in Key]: number | string | Reaction },
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
  const [orderBy, setOrderBy] = React.useState<keyof DataOrder>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [reaction, setReaction] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);
  const [editModal, setEditModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [orders, setOrders] = React.useState<DataOrders>([]);
  const [selectedId, setSelectedId] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const auth = useAuth();

  const [searchQuery, setSearchQuery] = React.useState('');


  React.useEffect(() => {
    console.log(auth.user?.token)
    fetch('http://127.0.0.1:8000/api/companies', {
      headers: {
        'Authorization': `Bearer ${auth.user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data: DataOrders) => setOrders(data))
      .catch((error) => console.error('Ошибка при получении данных:', error));
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DataOrder,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: any) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  const getLabelDisplayedRowsTo = () => {
    if (orders.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? orders.length
      : Math.min(orders.length, (page + 1) * rowsPerPage);
  };

  const isSelected = (name: any) => selected.indexOf(name) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      numeric: true,
      disablePadding: false,
      label: 'ID',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Название',
    },
    {
      id: 'com_limit',
      numeric: true,
      disablePadding: false,
      label: 'Об. лм',
    },
    {
      id: 'day_limit',
      numeric: true,
      disablePadding: false,
      label: 'Дн. лм',
    },
    {
      id: 'sound_file_id',
      numeric: true,
      disablePadding: false,
      label: 'Аудиофайл',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'Статус',
    },
    {
      id: 'phones_id',
      numeric: true,
      disablePadding: false,
      label: 'Список номеров',
    }
  ];

  const createSortHandler = (property: keyof DataOrder) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  function labelDisplayedRows({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  };

  // Handle search input
  const filteredOrders = orders.filter(orderr => {
    return orderr.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
        <EditCompanyModal id={selectedId} open={editModal} onClose={()=>setEditModal(false)}/>
        <DeleteCompanyModal id={selectedId} open={deleteModal} onClose={()=>setDeleteModal(false)}/>

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
          <Input 
            size="sm" 
            placeholder="Поиск" 
            startDecorator={<SearchIcon />} 
            value={searchQuery}
            onChange={handleSearchInputChange}
            />
        </FormControl>
        {/* {renderFilters()} */}
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
            '--TableCell-selectedBackground': (theme) =>
              theme.vars.palette.success.softBg,
            '& thead th:nth-child(1)': {
              width: '40px',
            },
            '& thead th:nth-child(2)': {
              width: '5%',
            },
          }}
        >
          <thead>
            <tr>
              <th>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < orders.length}
                  checked={orders.length > 0 && selected.length === orders.length}
                  onChange={handleSelectAllClick}
                  sx={{ verticalAlign: 'sub' }}
                />
              </th>
              {headCells.map((headCell) => {
                const active = orderBy === headCell.id;
                return (
                  <th
                    key={headCell.id}
                    aria-sort={
                      active
                        ? ({ asc: 'ascending', desc: 'descending' } as const)[order]
                        : undefined
                    }
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link
                      underline="none"
                      color="neutral"
                      textColor={active ? 'primary.plainColor' : undefined}
                      component="button"
                      onClick={createSortHandler(headCell.id)}
                      fontWeight="lg"
                      startDecorator={
                        headCell.numeric ? (
                          <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                        ) : null
                      }
                      endDecorator={
                        !headCell.numeric ? (
                          <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                        ) : null
                      }
                      sx={{
                        '& svg': {
                          transition: '0.2s',
                          transform:
                            active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                        },
                        '&:hover': { '& svg': { opacity: 1 } },
                      }}
                    >
                      {headCell.label}
                    </Link>
                  </th>
                );
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stableSort(filteredOrders, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(String(row.id));
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <tr
                    onClick={(event) => handleClick(event, row.id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    style={
                      isItemSelected
                      ? ({
                        '--TableCell-dataBackground':
                            'var(--TableCell-selectedBackground)',
                          '--TableCell-headBackground':
                            'var(--TableCell-selectedBackground)',
                      } as React.CSSProperties)
                      : {}
                    }
                  >
                    <td>
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                        sx={{ verticalAlign: 'top' }}
                      ></Checkbox>
                    </td>
                    <td>
                      {row.id}
                    </td>
                    <td id={labelId}>
                      {row.name}
                    </td>
                    <td>
                      <Typography level="body-xs">{row.com_limit}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.day_limit}</Typography>
                    </td>
                    <td>
                      <Link level="body-xs" component="button">
                          Прослушать {row.sound_file_id}
                      </Link>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        startDecorator={
                          {
                            '1': <AutorenewRoundedIcon />,
                            '0': <BlockIcon />,
                          }[row.status]
                        }
                        color={
                          {
                            '1': 'success',
                            '0': 'danger',
                          }[row.status] as ColorPaletteProp
                        }
                      >
                        {{
                          '1': 'В процессе',
                          '0': 'Остановлен',
                        }[row.status]}
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
                            <MenuItem onClick={() => { setSelectedId(+row.id); console.log(row.id); setEditModal(true);  }}>Редактировать</MenuItem>

                            <Divider />
                            <MenuItem  onClick={() => { setSelectedId(+row.id); setDeleteModal(true);  }} color="danger">Удалить</MenuItem>
                          </Menu>
                        </Dropdown>
                      </Box>
                    </td>
                  </tr>
                );
              })}
          {emptyRows > 0 && (
              <tr
                style={
                  {
                    height: `calc(${emptyRows} * 40px)`,
                    '--TableRow-hoverBackground': 'transparent',
                  } as React.CSSProperties
                }
              >
                <td colSpan={6} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={9}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{ minWidth: 80 }}>
                    {labelDisplayedRows({
                      from: orders.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: orders.length === -1 ? -1 : orders.length,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        orders.length !== -1
                          ? page >= Math.ceil(orders.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}