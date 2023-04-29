import React from 'react';
import { TextField } from '@mui/material';

export default function SearchBar({ pageDispatch }) {
  return (
    <TextField
      id='standard-basic'
      label='Search'
      variant='standard'
      onChange={(e) => {
        pageDispatch({ type: 'search', value: e.target.value });
      }}
    />
  );
}
