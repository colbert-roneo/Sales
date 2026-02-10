import React from 'react';
import { TextField, MenuItem, InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { updateHeader } from '../redux/slices/salesSlice';

const HeaderForm = () => {
  const dispatch = useDispatch();
  const header = useSelector((state) => state.sales.header);

  const handleChange = (field, value) => {
    dispatch(updateHeader({ [field]: value }));
  };

  return (
    <div className="header-form">
      <h2>Header Information</h2>
      <div className="form-grid">
        <TextField
          label="Voucher No"
          type="number"
          value={header.vr_no}
          onChange={(e) => handleChange('vr_no', e.target.value)}
          fullWidth
          required
          size="small"
        />
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Voucher Date"
            value={new Date(header.vr_date)}
            onChange={(date) => handleChange('vr_date', date.toISOString().split('T')[0])}
            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
          />
        </LocalizationProvider>

        <TextField
          label="Account Name"
          value={header.ac_name}
          onChange={(e) => handleChange('ac_name', e.target.value)}
          fullWidth
          required
          size="small"
        />

        <TextField
          label="Status"
          select
          value={header.status}
          onChange={(e) => handleChange('status', e.target.value)}
          fullWidth
          size="small"
        >
          <MenuItem value="A">Active</MenuItem>
          <MenuItem value="I">Inactive</MenuItem>
        </TextField>

        <TextField
          label="Total Amount"
          value={header.ac_amt.toFixed(2)}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            readOnly: true,
          }}
          fullWidth
          size="small"
        />
      </div>
    </div>
  );
};

export default HeaderForm;