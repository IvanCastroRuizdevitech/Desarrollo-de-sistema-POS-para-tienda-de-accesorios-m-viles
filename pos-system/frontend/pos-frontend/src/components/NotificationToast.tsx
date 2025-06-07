import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Notification } from '../contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  autoHideDuration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  autoHideDuration = 6000
}) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  
  useEffect(() => {
    setOpen(true);
  }, [notification.id]);
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    onClose();
  };
  
  const handleNavigate = () => {
    if (notification.link) {
      navigate(notification.link);
    }
    handleClose();
  };
  
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={notification.type}
        variant="filled"
        onClose={handleClose}
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>{notification.title}</AlertTitle>
        <Typography variant="body2">{notification.message}</Typography>
        
        {notification.link && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleNavigate}
              sx={{ 
                p: 0.5,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

