import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useWishlist, useWishlistDispatch } from './WishlistContext';

export default function Add({ token }) {
  const { add } = useWishlist();
  const { addContent, updateAddForm, validateAddedContent } =
    useWishlistDispatch();

  const handleSubmit = async () => {
    if (!validateAddedContent(add.title, add.description, add.image)) return;
    addContent({
      jwt: token,
      title: add.title,
      description: add.description,
      image: add.image,
    });
  };
  return (
    <Box
      sx={{
        paddingTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        gridColumn: 'span 2 / span 2',
        gridColumnStart: 2,
      }}
    >
      <TextField
        label='Title'
        name='title'
        placeholder='Enter product title'
        value={add.title}
        onChange={(e) => updateAddForm(e.target)}
      />
      <TextField
        label='Description'
        name='description'
        placeholder='Enter product description'
        value={add.description}
        onChange={(e) => updateAddForm(e.target)}
      />
      <TextField
        label='Image'
        name='image'
        placeholder='Enter link to product image'
        value={add.image}
        onChange={(e) => updateAddForm(e.target)}
      />
      <LoadingButton
        variant='contained'
        onClick={handleSubmit}
        loading={add.loading}
      >
        Submit
      </LoadingButton>
    </Box>
  );
}
