import React from 'react';
import {
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addDetailRow, removeDetailRow, updateDetailRow } from '../redux/slices/salesSlice';
import { fetchItems } from '../redux/slices/itemSlice';

const DetailForm = () => {
  const dispatch = useDispatch();
  const details = useSelector((state) => state.sales.details);
  const { items, loading: itemsLoading } = useSelector((state) => state.items);

  const handleAddRow = () => {
    dispatch(addDetailRow());
  };

  const handleRemoveRow = (index) => {
    dispatch(removeDetailRow(index));
  };

  const handleItemChange = (index, itemData) => {
    if (itemData) {
      dispatch(updateDetailRow({
        index,
        field: 'item_code',
        value: itemData.item_code || ''
      }));
      dispatch(updateDetailRow({
        index,
        field: 'item_name',
        value: itemData.item_name || ''
      }));
    } else {
      dispatch(updateDetailRow({
        index,
        field: 'item_code',
        value: ''
      }));
      dispatch(updateDetailRow({
        index,
        field: 'item_name',
        value: ''
      }));
    }
  };

  const handleInputChange = (index, field, value) => {
    dispatch(updateDetailRow({ index, field, value }));
  };

  const loadItems = () => {
    if (items.length === 0) {
      dispatch(fetchItems());
    }
  };

  return (
    <div className="detail-form">
      <div className="detail-header">
        <h2>Details</h2>
        <IconButton color="primary" onClick={handleAddRow}>
          <AddCircle />
        </IconButton>
      </div>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.sr_no}</TableCell>
                <TableCell width="250px">
                  <Autocomplete
                    options={items}
                    getOptionLabel={(option) => 
                      `${option.item_code || ''} - ${option.item_name || ''}`
                    }
                    value={items.find(item => item.item_code === row.item_code) || null}
                    onChange={(event, newValue) => handleItemChange(index, newValue)}
                    onOpen={loadItems}
                    loading={itemsLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Item"
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {itemsLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell width="120px">
                  <TextField
                    type="number"
                    value={row.qty}
                    onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 1 }}
                  />
                </TableCell>
                <TableCell width="120px">
                  <TextField
                    type="number"
                    value={row.rate}
                    onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </TableCell>
                <TableCell width="120px">
                  <TextField
                    value={row.amount.toFixed(2)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      readOnly: true,
                    }}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveRow(index)}
                    disabled={details.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DetailForm;