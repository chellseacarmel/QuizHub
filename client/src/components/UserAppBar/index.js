import { useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { UserContext } from '../../App';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Box,
  Avatar,
  Typography,
} from '@mui/material';

function UserAppBar() {
  const { user, dispatch } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const setUserInfo = async () => {
    const userInfo = await axios.get(
      process.env.NODE_ENV === 'production'
        ? `/api/auth`
        : `http://localhost:4000/api/auth`,
      { withCredentials: true }
    );
    console.log('userInfo', userInfo);
    dispatch({ type: 'signin', payload: userInfo.data });
  };

  useEffect(() => {
    setUserInfo();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signoutClickHandler = async () => {
    try {
      // await axios.delete(`/api/auth`);
      await axios.delete(
        process.env.NODE_ENV === 'production'
          ? `/api/auth/`
          : `http://localhost:4000/api/auth`,
        { withCredentials: true }
      );
      dispatch({ type: 'signout' });
      history.push('/');
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  const id = user?.id ? user.id : '';

  console.log('id: ', id);

  const isCreator =
    user?.isCreator === undefined
      ? undefined
      : user.isCreator
      ? 'Creator'
      : 'Consumer';

  return (
    <AppBar position='static' color='common'>
      <Toolbar color='white'>
        {/* consumer profile page */}
        {/* <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton> */}

        {/* TODO: adjust our logo */}
        <Box style={{ flex: 1 }}>
          <img
            className='headerName'
            src='/logo.png'
            width='130'
            onClick={() => {
              if (user.isCreator === false) {
                history.push('/consumerHome');
              } else if (user.isCreator === true) {
                history.push('/creatorHome');
              } else {
                history.push('/');
              }
            }}
          />
        </Box>
        {id === '' ? (
          <Button
            variant='contained'
            onClick={() => {
              history.push('/auth/signin');
            }}
          >
            Login
          </Button>
        ) : (
          <div>
            {/* <Typography>
                            {user.username}
                        </Typography> */}
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              {/* TODO: add profile avatar */}
              {/* <AccountCircle /> */}
              <Avatar
                src={user.img}
                style={{
                  width: '40px',
                  height: '40px',
                }}
                alt={user.username}
              />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  if (isCreator == 'Creator') {
                    // history.push('/creatoraccountsettings');
                    history.push('creator-page');
                    handleClose();
                  } else {
                    history.push('/consumer-page');
                    handleClose();
                  }
                }}
              >
                My page
              </MenuItem>
              <MenuItem onClick={signoutClickHandler}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default UserAppBar;
