import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// self imported icons
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import BoltIcon from '@mui/icons-material/Bolt';
import PieChartIcon from '@mui/icons-material/PieChart';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import Avatar from '@mui/material/Avatar';

//route components
import ExploreRoles from './ExploreRoles';
import LearningJourney from './LearningJourney';
import ViewLJ from './ViewLJ';
import ManageLJ from './ManageLJ';

import Login from './Login';

// admin Routes
import Roles from './admin/Roles';
import Courses from './admin/Courses';
import Skills from './admin/Skills';
import Employees from './admin/Employees';
import StaffDetails from './admin/StaffDetails';

import {useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom"

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom"

const drawerWidth = 230;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // const [loggedIn, setLoggedIn] = useState(false);
  // const [staffid, setStaffid] = useState("");
  // const [role, setRole] = useState("");
  // const [name, setName] = useState("");


  //const { state } = useLocation();
  // console.log(state)

  // const [isAdmin, setIsAdmin] = useState(false);
  // const [isManager, setIsManager] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear()
    navigate(`/`)
  }

  const name = JSON.parse(localStorage.getItem("name"));
  const role = JSON.parse(localStorage.getItem("role"));
  const isLogin = localStorage.getItem("login");

  console.log(isLogin)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const adminDrawer = (
    <div>
      <Toolbar />
        <Grid sx={{marginTop: '-20px', marginBottom: '20px', position: 'relative'}} container>
            <Grid item xs={4}>
              <Avatar
                  alt='Robert Meyer'
                  src= {require ("../assets/avatars/avatar1.png")}
                  sx={{
                  width: 50,
                  height: 50,
                  marginLeft: '10px',
                  marginRight: '10px'
                  }}
              />

            </Grid>
            <Grid item xs={6} columnSpacing={{ xs: 1, sm: 2, md: 2}}>
              <Typography variant="body1">
                {name}
              </Typography>
              <Typography variant="body2">
                {role}
              </Typography>
            </Grid>
        </Grid>

        <Divider />
        <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Staff View</Typography>
        <List>
          {['Learning Journey', 'Explore'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <Link to={`/${text.replace(/\s/g, "")}`}>
                  <ListItemButton>
                  <ListItemIcon>
                      {index === 0 ? <SchoolIcon /> : <ExploreIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                  </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>


      <Divider />
      <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Admin View</Typography>

      <List>
        {['Skills', 'Courses', 'Roles', 'Employees'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <Link to={`/admin${text.replace(/\s/g, "")}`}>
                <ListItemButton>
                <ListItemIcon >
                    {index === 0 ? <BoltIcon /> : index === 1 ? <PieChartIcon /> : index===2 ? <WorkIcon /> : <GroupIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Support</Typography>
      <List>
        {['Help', 'Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <Link to={`/${text.replace(/\s/g, "")}`}>
                <ListItemButton>
                <ListItemIcon>
                    {index === 0 ? <HelpIcon /> : index === 1 ? <SettingsIcon /> : <HomeIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>



        <Button variant='contained' sx={{ width:'90%', margin:'10px', padding:'10px', position:'absolute', bottom:'10px'}} onClick={logout}>Logout</Button>
    </div>
  );

  const managerDrawer = (
    <div>
      <Toolbar />
        <Grid sx={{marginTop: '-20px', marginBottom: '20px', position: 'relative'}} container>
            <Grid item xs={4}>
              <Avatar
                  alt='Robert Meyer'
                  src= {require ("../assets/avatars/avatar1.png")}
                  sx={{
                  width: 50,
                  height: 50,
                  marginLeft: '10px',
                  marginRight: '10px'
                  }}
              />

            </Grid>
            <Grid item xs={6} columnSpacing={{ xs: 1, sm: 2, md: 2}}>
              <Typography variant="body1">
                {name}
              </Typography>
              <Typography variant="body2">
                {role}
              </Typography>
            </Grid>
        </Grid>

        <Divider />
        <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Staff View</Typography>
        <List>
          {['Learning Journey', 'Explore'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <Link to={`/${text.replace(/\s/g, "")}`}>
                  <ListItemButton>
                  <ListItemIcon>
                      {index === 0 ? <SchoolIcon /> : <ExploreIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                  </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>


      <Divider />
      <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Admin View</Typography>

      <List>
        {['Roles', 'Employees'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <Link to={`/admin${text.replace(/\s/g, "")}`}>
                <ListItemButton>
                <ListItemIcon >
                    {index === 0 ? <WorkIcon /> : <GroupIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Support</Typography>
      <List>
        {['Help', 'Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <Link to={`/${text.replace(/\s/g, "")}`}>
                <ListItemButton>
                <ListItemIcon>
                    {index === 0 ? <HelpIcon /> : index === 1 ? <SettingsIcon /> : <HomeIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>



        <Button variant='contained' sx={{ width:'90%', margin:'10px', padding:'10px', position:'absolute', bottom:'10px'}} onClick={logout}>Logout</Button>
    </div>
  );

    const userDrawer = (
    <div>
      <Toolbar />
        <Grid sx={{marginTop: '-20px', marginBottom: '20px', position: 'relative'}} container>
            <Grid item xs={4}>
              <Avatar
                  alt='Robert Meyer'
                  src= {require ("../assets/avatars/avatar1.png")}
                  sx={{
                  width: 50,
                  height: 50,
                  marginLeft: '10px',
                  marginRight: '10px'
                  }}
              />

            </Grid>
            <Grid item xs={6} columnSpacing={{ xs: 1, sm: 2, md: 2}}>
              <Typography variant="body1">
                {name}
              </Typography>
              <Typography variant="body2">
                {role}
              </Typography>
            </Grid>
        </Grid>

        <Divider />
        <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Staff View</Typography>
        <List>
          {['Learning Journey', 'Explore'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <Link to={`/${text.replace(/\s/g, "")}`}>
                  <ListItemButton>
                  <ListItemIcon>
                      {index === 0 ? <SchoolIcon /> : <ExploreIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                  </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

      <Divider />
      <Typography variant="h2" color='primary' sx={{ pt: '20px', paddingLeft: '15px'}}>Support</Typography>
      <List>
        {['Help', 'Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <Link to={`/${text.replace(/\s/g, "")}`}>
                <ListItemButton>
                <ListItemIcon>
                    {index === 0 ? <HelpIcon /> : index === 1 ? <SettingsIcon /> : <HomeIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>



        <Button variant='contained' sx={{ width:'90%', margin:'10px', padding:'10px', position:'absolute', bottom:'10px'}} onClick={logout}>Logout</Button>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (


    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {localStorage.getItem("login") === "true" ?
      <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Learning Management System
          </Typography>
        </Toolbar>
      </AppBar>
       </> : null }
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >


        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        { role === "Admin" ?
          <>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {adminDrawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {adminDrawer}
          </Drawer>
             </> :
              null
            }

            { role === "Manager" ?
          <>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {managerDrawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {managerDrawer}
          </Drawer>
             </> :
              null
            }

             { role === "User" || role === "Trainer" ?
          <>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {userDrawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {userDrawer}
          </Drawer>
             </> :
              null
            }




      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

               <Routes>
                  <Route
                    path="/"
                    element={<Login/>}
                  />
                  <Route
                    path="/Explore"
                    element={<ExploreRoles />}
                  />
                  <Route
                    path="/LearningJourney"
                    element={<ViewLJ></ViewLJ>}
                  />
                  <Route
                    path="/ManageLearningJourney/:LJName"
                    element={<ManageLJ></ManageLJ>}
                  />
                  <Route
                    path="/CreateLearningJourney/:role"
                    element={<LearningJourney></LearningJourney>}
                  />
                  <Route
                    path="/Help"
                    element={<div>Help</div>}
                  />
                  <Route
                    path="/Settings"
                    element={<div>Settings</div>}
                  />

                  <Route
                    path="/adminSkills"
                    element={<Skills/>}
                  />
                  <Route
                    path="/adminCourses"
                    element={<Courses/>}
                  />
                  <Route
                    path="/adminEmployees"
                    element={<Employees/>}
                  />
                  <Route
                    path="/adminRoles"
                    element={<Roles/>}
                  />
                  <Route
                    path="/StaffDetails/:id"
                    element={<StaffDetails/>}
                  />
              </Routes>

          </Box>

      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
