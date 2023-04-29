import { useReducer } from 'react';
import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useUserDispatch } from './UserContext';

const initialState = {
  title: '',
  description: '',
  image: '',
  loading: false,
};

const addCardReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        [action.target]: action.value,
      };
    }
    case 'reset': {
      return {
        ...initialState,
        loading: false,
      };
    }
    case 'loading': {
      return {
        ...state,
        loading: action.loading,
      };
    }
  }
};

export default function Add({ token, pageDispatch }) {
  const { addContent } = useUserDispatch();
  const [addCardData, addCardDispatch] = useReducer(
    addCardReducer,
    initialState
  );
  const handleSubmit = async () => {
    addCardDispatch({ type: 'loading', loading: true });
    try {
      await addContent({
        jwt: token,
        title: addCardData.title,
        description: addCardData.description,
        image: addCardData.image,
      });
      addCardDispatch({ type: 'loading', loading: false });
      addCardDispatch({ type: 'reset' });
      pageDispatch({ type: 'message', text: 'Card Added!' });
    } catch (err) {
      addCardDispatch({ type: 'loading', loading: false });
      pageDispatch({ type: 'message', text: 'Error Adding card.' });
      console.log(`Error adding card: ${err}`);
    }
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
        value={addCardData.title}
        onChange={(e) => {
          addCardDispatch({
            type: 'update',
            target: 'title',
            value: e.target.value,
          });
        }}
      />
      <TextField
        label='Description'
        name='description'
        placeholder='Enter product description'
        value={addCardData.description}
        onChange={(e) => {
          addCardDispatch({
            type: 'update',
            target: 'description',
            value: e.target.value,
          });
        }}
      />
      <TextField
        label='Image'
        name='image'
        placeholder='Enter link to product image'
        value={addCardData.image}
        onChange={(e) => {
          addCardDispatch({
            type: 'update',
            target: 'image',
            value: e.target.value,
          });
        }}
      />
      <LoadingButton
        variant='contained'
        onClick={handleSubmit}
        loading={addCardData.loading}
      >
        Submit
      </LoadingButton>
    </Box>
  );
}
