import './App.css';
import GlobalStyle from './globalStyles'
import { createTheme, ThemeProvider } from '@mui/material';

import SideBar from './components/Sidebar';
import Login from './components/Login';
import { useEffect,useState } from 'react';


const theme = createTheme({
  palette: {
    primary: {
      main: '#223842'
    },
    secondary: {
      main: '#d77a61'
    },
    info: {
      main: '#9ADBB5'
    }
  },
  typography: {
    h1: {
      fontFamily: 'Inter-Bold',
      fontSize: '26px',
      color: '#223842'
    },
    h2: {
      fontFamily: 'Inter-Bold',
      fontSize: '16px',
      color: '#223842'
    },
    body1: {
      fontFamily: 'Inter-Regular',
      fontSize: '16px',
      color: '#223842'
    },
    subtitle1: {
      fontFamily: 'Inter-Light',
      fontSize: '16px',
      color: '#223842'
    }
  }
})

function App() {
  // const arr = pathName.toString().split("/");
  // const currentPath = arr[arr.length-1];
  const [display, setDisplay] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [staffid, setStaffid] = useState("");

  useEffect(()=>{
    if (window.location.pathname === "/"){
      setDisplay(false)
    }else{
      setDisplay(true)
    }
  },[window.location.pathname])

  return (
    <>
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
      <SideBar/>
    </ThemeProvider>
    </>

  );
}

export default App;
