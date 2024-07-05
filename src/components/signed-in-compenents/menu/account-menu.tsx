import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DiamondIcon from '@mui/icons-material/Diamond';
import CommentIcon from '@mui/icons-material/Comment';
import { Favorite, History, Logout, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import PersonIcon from '@mui/icons-material/Person';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogOut = () => {
    logout();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="large"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{width:"100%",height:"100%"}}
          >
            <Avatar sx={{ width: 56, height: 56, backgroundColor: "white" }}>
              <PersonIcon sx={{ width:"50%",height:"50%",color:"#3acbe1"}}/>
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 52,
              height: 52,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 20,
              height: 20,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
            '& .MuiMenuItem-root': {
              fontSize: '1.25rem',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem',
            },
            '& .MuiPaper-root': {
              minWidth: 200,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuItemClick('/account-settings')}>
          <Avatar /> Account Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuItemClick('/booking-history')}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          Booking and Travel History
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/ph-point')}>
          <ListItemIcon>
            <DiamondIcon fontSize="small" />
          </ListItemIcon>
          PH Points
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/review-comments')}>
          <ListItemIcon>
            <CommentIcon fontSize="small" />
          </ListItemIcon>
          Review & Comments
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/favorites')}>
          <ListItemIcon>
            <Favorite fontSize="small" />
          </ListItemIcon>
          Favorites
        </MenuItem>
        {user?.isAdmin && (
          <MenuItem onClick={() => handleMenuItemClick('/admin-panel')}>
            <ListItemIcon>
              <AdminPanelSettings fontSize="small" />
            </ListItemIcon>
            Panel
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
