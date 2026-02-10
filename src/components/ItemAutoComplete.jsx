import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../redux/slices/itemSlice';

const ItemAutocomplete = ({ index, value, onChange }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.items);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (open && items.length === 0) {
      dispatch(fetchItems());
    }
  }, [open, dispatch, items.length]);

  const handleItemSelect = (event, newValue) => {
    if (newValue) {
      onChange(index, {
        item_code: newValue.item_code,
        item_name: newValue.item_name
      });
    } else {
      onChange(index, {
        item_code: '',
        item_name: ''
      });
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={items}
      getOptionLabel={(option) => `${option.item_code} - ${option.item_name}`}
      loading={loading}
      value={items.find(item => item.item_code === value.item_code) || null}
      onChange={handleItemSelect}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Item"
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ItemAutocomplete;