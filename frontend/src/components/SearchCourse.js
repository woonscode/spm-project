import * as React from 'react';
import {useState,useEffect} from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CourseCard from './CourseCard'

export default function CustomizedInputBase({courses,selectedSkills, setSelectedCourses, selectedCourses, setAttainedSkills, attainedSkills}) {

  // Define useStates for search and displayed courses:
  const  [search,setSearch] = useState("");
  const  [displayCourses, setDisplayCourses] = useState([]);

  // Define useEffect that changes based on search term and update displayedCourse
  useEffect(() =>{

    console.log(selectedSkills)
    console.log(courses)
    // Use a filter function to filter and update displayedCourse based on search
    if (courses && courses.length){
      let filtered = courses.filter(i=>{
        return i.toLowerCase().includes(search.toLowerCase())
       })
     
      setDisplayCourses(filtered)
    } else {
      setDisplayCourses([])
    }
  },[search,courses,selectedSkills])

  return (
    <>
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F3F3F3' }}
    >

      <InputBase
        onChange={(e)=>{setSearch(e.target.value)}}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search courses..."
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
    {/* {displayCourses} */}
    <Grid sx={{mt: 3}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
    {displayCourses&&
    displayCourses.length?
      displayCourses.map((course, index)=>{
        return(
            <Grid key={index} item xs={12} sm={6} md={6}>
                <CourseCard
                    courseName={course}
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                    attainedSkills={attainedSkills}
                    setAttainedSkills={setAttainedSkills}
                />
            </Grid>
              )}): 
              // if selectedSkills is empty, display nothing
              // if selectedSkills is not empty, display "No Courses Found"
              selectedSkills.length ? <Typography variant="body1" sx={{mx: 2, py: 2, textAlign: 'center', width:'100%'}}>No Courses Found</Typography>:null
        }
      </Grid>
    </>
  );
}
