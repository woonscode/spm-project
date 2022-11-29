import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import SearchBar from './SearchBar'
import CourseCard from './CourseCard'
import RoleCard from './RoleCard'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function ToggleBar() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Box = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ffff'
  })
  )

  return (

    <Box sx={{ width: '100%' }} elevation={3}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="full width tabs example">
        <Tab label="Courses" />
        <Tab label="Roles" />
        </Tabs>

      <TabPanel value={value} index={0}>

        <SearchBar></SearchBar>
          <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
            <Grid item xs={12} sm={5} md={3}>
              <CourseCard/>
            </Grid>

            <Grid item xs={12} sm={5} md={3}>
              <CourseCard/>
            </Grid>

            <Grid item xs={12} sm={5} md={3}>
              <CourseCard/>
            </Grid>

            <Grid item xs={12} sm={5} md={3}>
              <CourseCard/>
            </Grid>

            <Grid item xs={12} sm={5} md={3}>
              <CourseCard/>
            </Grid>

          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <SearchBar></SearchBar>
          <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3  }}>
            <Grid item xs={12} sm={6} md={3}>
              <RoleCard/>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
  );
}