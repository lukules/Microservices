import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Dostosuj ścieżkę do lokalizacji AuthContext
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; 
import Main from './components/Main';


function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Main />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
