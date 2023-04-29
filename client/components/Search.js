import React from 'react';
import { TextField } from '@mui/material';
import { useWishlistDispatch } from '.';

export default function SearchBar() {
  const { updateSearchQuery } = useWishlistDispatch();
  return (
    <TextField
      id='standard-basic'
      label='Search'
      variant='standard'
      onChange={(e) => updateSearchQuery(e.target.value)}
    />
  );
}
