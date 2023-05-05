import { useState } from 'react';
import {
  Box,
  Card as MUICard,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Delete } from '@mui/icons-material';
import { useWishlistDispatch } from '.';

export default function Card({ token, card }) {
  const { id, title, image, description } = card;
  const { deleteContent, updatePageMessage } = useWishlistDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setOpen(false);
    setLoading(true);
    try {
      await deleteContent({ token, id });
      updatePageMessage('Card Deleted.');
    } catch (err) {
      updatePageMessage('Error Deleting Card.', 'error');
      console.log(`An error occurred deleting a card: ${err}`);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 'auto',
        width: 300,
        height: 350,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <MUICard>
        <CardMedia
          component='img'
          height='140'
          width='260'
          src={image}
          alt='coral_image'
        />
        <CardContent sx={{ justifySelf: 'center' }}>
          <Box>
            <Typography variant='h5' gutterBottom>
              {title}
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            loading={loading}
            onClick={() => setOpen(true)}
            size='small'
            variant='text'
          >
            <Delete />
          </LoadingButton>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              {'Are you sure you want to delete this?'}
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleDelete} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </CardActions>
      </MUICard>
    </Box>
  );
}
