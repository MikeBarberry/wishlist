import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useWishlist, useWishlistDispatch, Search, Card, Add } from '.';

export default function UserPage() {
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const { user, page } = useWishlist();
  const { logoutUser, increaseCardCount, updatePageMessage, getUserContent } =
    useWishlistDispatch();

  useEffect(() => {
    if (token) {
      getUserContent(token);
    } else {
      navigate('/');
    }
  }, [user.isAuthenticated]);

  const filterCards = (content, search, numCards) => {
    return content
      .filter((card) => card.title.toLowerCase().includes(search.toLowerCase()))
      .slice(0, numCards);
  };

  const visibleCards = useMemo(
    () => filterCards(user.content, page.search, page.numCards),
    [user.content, page.search, page.numCards]
  );

  const tokenProp = { token };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ff6347',
        overflowY: 'scroll',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          height: '17pc',
          width: '100%',
          backgroundColor: 'white',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1em',
          borderBottom: '4mm ridge rgb(170, 50, 220, .6)',
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            gridColumnStart: 1,
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'end',
            paddingBottom: '25px',
          }}
        >
          <Button
            variant='outlined'
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
          >
            Logout <ExitToApp />
          </Button>
        </Box>
        <Add {...tokenProp} />
        <Box
          sx={{
            gridColumnStart: 4,
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'end',
            paddingBottom: '25px',
          }}
        >
          <Search />
        </Box>
      </Box>
      <Box
        sx={{
          paddingTop: '3em',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '10px',
          maxWidth: '100%',
          paddingLeft: '20px',
        }}
      >
        {page.loading ? (
          <Box sx={{ position: 'absolute', top: '50%', right: '50%' }}>
            <CircularProgress color='inherit' />
          </Box>
        ) : (
          visibleCards.map((card) => {
            return <Card key={card.title} card={card} {...tokenProp} />;
          })
        )}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: '7%' }}>
          <Button
            onClick={increaseCardCount}
            variant='contained'
            sx={{ marginBottom: '5px' }}
            disabled={user.content.length <= page.numCards}
          >
            Show Next Row
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={page.message.visible}
        onClose={() => updatePageMessage('')}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={page.message.severity} sx={{ width: '100%' }}>
          {page.message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
