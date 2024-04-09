import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#14213d', 
      contrastText: '#ffffff', 
    },
    secondary: {
      main: '#fca311', 
      light: '#ff6659', 
      dark: '#9a0007', 
      contrastText: '#ffffff', 
    },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
    h6: {
      fontSize: '2.25rem', 
    },
    h4: {
      fontSize: '3rem',
    },
  },
});

export default theme;
