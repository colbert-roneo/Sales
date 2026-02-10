import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const submitSalesData = createAsyncThunk(
  'sales/submit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/header/multiple', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    header: {
      vr_no: '',
      vr_date: new Date().toISOString().split('T')[0],
      ac_name: '',
      ac_amt: 0,
      status: 'A'
    },
    details: [
      {
        sr_no: 1,
        item_code: '',
        item_name: '',
        description: '',
        qty: 1,
        rate: 0,
        amount: 0
      }
    ],
    loading: false,
    error: null,
    success: false,
    savedVoucher: null
  },
  reducers: {
    updateHeader: (state, action) => {
      state.header = { ...state.header, ...action.payload };
    },
    addDetailRow: (state) => {
      const newSrNo = state.details.length + 1;
      state.details.push({
        sr_no: newSrNo,
        item_code: '',
        item_name: '',
        description: '',
        qty: 1,
        rate: 0,
        amount: 0
      });
    },
    removeDetailRow: (state, action) => {
      if (state.details.length > 1) {
        state.details = state.details.filter(
          (_, index) => index !== action.payload
        );
        state.details.forEach((detail, index) => {
          detail.sr_no = index + 1;
        });
      }
    },
    updateDetailRow: (state, action) => {
      const { index, field, value } = action.payload;
      state.details[index][field] = value;
      
      if (field === 'qty' || field === 'rate') {
        const qty = parseFloat(state.details[index].qty) || 0;
        const rate = parseFloat(state.details[index].rate) || 0;
        state.details[index].amount = qty * rate;
      }
      
      const total = state.details.reduce((sum, item) => sum + (item.amount || 0), 0);
      state.header.ac_amt = total;
    },
    clearForm: (state) => {
      state.header = {
        vr_no: '',
        vr_date: new Date().toISOString().split('T')[0],
        ac_name: '',
        ac_amt: 0,
        status: 'A'
      };
      state.details = [{
        sr_no: 1,
        item_code: '',
        item_name: '',
        description: '',
        qty: 1,
        rate: 0,
        amount: 0
      }];
      state.error = null;
      state.success = false;
    },
    setSavedVoucher: (state, action) => {
      state.savedVoucher = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitSalesData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.savedVoucher = {
          header: state.header,
          details: state.details
        };
      })
      .addCase(submitSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Submission failed';
      });
  }
});

export const {
  updateHeader,
  addDetailRow,
  removeDetailRow,
  updateDetailRow,
  clearForm,
  setSavedVoucher
} = salesSlice.actions;

export default salesSlice.reducer;