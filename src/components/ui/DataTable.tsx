import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  alpha,
  TableSortLabel,
} from '@mui/material';
import { Delete, FilterList } from '@mui/icons-material';
import { useState } from 'react';

/**
 * 表格列定义接口
 */
export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown) => string | number;
}

/**
 * DataTable 组件属性接口
 */
interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  title?: string;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  sortable?: boolean;
}

/**
 * 表格工具栏组件
 */
interface TableToolbarProps {
  title: string;
  numSelected: number;
  onDeleteClick?: () => void;
}

function TableToolbar({ title, numSelected, onDeleteClick }: TableToolbarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          已选择 {numSelected} 项
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}
      {numSelected > 0 ? (
        <IconButton onClick={onDeleteClick}>
          <Delete />
        </IconButton>
      ) : (
        <IconButton>
          <FilterList />
        </IconButton>
      )}
    </Toolbar>
  );
}

/**
 * Material UI DataTable 组件
 *
 * @description 可复用的数据表格组件，支持选择、排序、分页等功能
 *
 * @template T 数据行类型
 * @param columns 表格列定义数组
 * @param rows 表格数据数组
 * @param title 表格标题
 * @param selectable 是否支持行选择
 * @param onSelectionChange 选择变化回调函数
 * @param onRowClick 行点击回调函数
 * @param stickyHeader 是否启用固定表头
 * @param maxHeight 表格最大高度
 * @param sortable 是否支持排序
 */
export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  title = '数据表格',
  selectable = false,
  onSelectionChange,
  onRowClick,
  stickyHeader = true,
  maxHeight = 440,
  sortable = false,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      if (onSelectionChange) {
        onSelectionChange(rows);
      }
      return;
    }
    setSelected([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: T) => {
    if (selectable) {
      const selectedIndex = selected.indexOf(row.id);
      let newSelected: (string | number)[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, row.id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
      if (onSelectionChange) {
        const selectedRows = rows.filter((r) => newSelected.includes(r.id));
        onSelectionChange(selectedRows);
      }
    }

    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;

  const sortedRows = [...rows].sort((a, b) => {
    if (!orderBy) return 0;

    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {title && (
        <TableToolbar
          title={title}
          numSelected={selected.length}
          onDeleteClick={() => {
            setSelected([]);
            if (onSelectionChange) {
              onSelectionChange([]);
            }
          }}
        />
      )}
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader} aria-label="data table">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': '选择全部',
                    }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: onRowClick || selectable ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': `table-checkbox-${row.id}`,
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={String(column.id)} align={column.align}>
                        {column.format ? column.format(value) : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="每页行数:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count} 条`}
      />
    </Paper>
  );
}

/**
 * 简单表格组件
 *
 * @description 简化版本的表格组件，不包含分页和选择功能
 */
interface SimpleTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  stickyHeader?: boolean;
  maxHeight?: number | string;
}

export function SimpleTable<T extends { id: string | number }>({
  columns,
  rows,
  stickyHeader = false,
  maxHeight,
}: SimpleTableProps<T>) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight }}>
      <Table stickyHeader={stickyHeader} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.id)}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={String(column.id)} align={column.align}>
                    {column.format ? column.format(value) : String(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
