import { useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useUserData, useUserDispatch, Search, Card, Add } from '.';

const initialState = {
  search: '',
  numCards: 8,
  message: {
    visible: false,
    text: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'add_cards': {
      return {
        ...state,
        numCards: state.numCards + 4,
      };
    }
    case 'message': {
      return {
        ...state,
        message: {
          visible: !!action.text,
          text: action.text,
        },
      };
    }
    case 'search': {
      return {
        ...state,
        search: action.value,
      };
    }
  }
};

export default function UserPage() {
  const user = useUserData();
  const { logoutUser } = useUserDispatch();
  const [pageData, pageDispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate('/');
    }
  }, [user.isAuthenticated]);

  const filterCards = (content, search, numCards) => {
    return content
      .filter((card) => {
        const tlcTitle = card.title.toLowerCase();
        const tlcSearch = search.toLowerCase();
        return tlcTitle.includes(tlcSearch);
      })
      .slice(0, numCards);
  };

  const visibleCards = useMemo(
    () => filterCards(user.content, pageData.search, pageData.numCards),
    [user.content, pageData.search, pageData.numCards]
  );

  const pageContext = {
    pageData: pageData,
    pageDispatch: pageDispatch,
    token: token,
  };

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
          <Button variant='outlined' onClick={logoutUser}>
            Logout <ExitToApp />
          </Button>
        </Box>
        <Add {...pageContext} />
        <Box
          sx={{
            gridColumnStart: 4,
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'end',
            paddingBottom: '25px',
          }}
        >
          <Search {...pageContext} />
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
        {visibleCards.map((card) => {
          return <Card key={card.title} card={card} {...pageContext} />;
        })}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: '7%' }}>
          <Button
            onClick={() => {
              pageDispatch({ type: 'add_cards' });
            }}
            variant='contained'
            sx={{ marginBottom: '5px' }}
            disabled={user.content.length <= pageData.numCards}
          >
            Show Next Row
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={pageData.message.visible}
        onClose={() => {
          pageDispatch({ type: 'message', text: '' });
        }}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity='success' sx={{ width: '100%' }}>
          {pageData.message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
