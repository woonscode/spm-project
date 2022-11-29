import * as React from 'react';
import {useState,useEffect} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Button from '@mui/material/Button';

export default function CourseButton({course, setSelectedCourses, selectedCourses, attainedSkills, setAttainedSkills}) {
  // const [isActive, setIsActive] = useState(false);
  const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [courseSkills, setCourseSkills] = useState([]);

    const addSkillsAttained = () => {
        let temp = {...attainedSkills};

        courseSkills.forEach(skill => {
            if (temp[skill] === undefined) {
                temp[skill] = 1;
            } else {
                temp[skill] += 1;
            }
        })
        setAttainedSkills(temp);
    }

    const removeSkillsAttained = () => {
        let temp = {...attainedSkills};
        courseSkills.forEach(skill => {
            if (temp[skill] === undefined) {
                temp[skill] = 0;
            } else {
                temp[skill] -= 1;
            }
        })
        for (let skill in temp) {
            if (temp[skill] <= 0) {
                delete temp[skill];
            }
        }
        setAttainedSkills(temp);
    }


  const updateSelection = (course) =>{
    if (selectedCourses.length && selectedCourses.includes(course)){
        console.log(selectedCourses);
        let newArr = selectedCourses.filter((i)=>{return i!==course})
        
        setSelectedCourses(newArr);
        removeSkillsAttained();
    }else{
        setSelectedCourses([...selectedCourses,course])
        addSkillsAttained();
    }
}

    const handleClick = () => {
      updateSelection(course);
    };

    useEffect(()=>{
      // Define Async function to query getSkills API for a job role
      const getCourseInfo = async () => {
          try {
              // Get the skills attainable from course
              console.log(`${url}findfilteredskillswithcourse/${encodeURIComponent(course.trim())}`)
              const response2 = await axios.get( `${url}findfilteredskillswithcourse/${encodeURIComponent(course.trim())}`)
              console.log(response2.data.data.skills)
              setCourseSkills(response2.data.data.skills)
          } catch(e) {
              console.log(e);
              alert("Axios Error")
          }
      }

      // Invoke api
      getCourseInfo();
    },[])

  return (
    // <Card variant='outlined' sx={{ display: 'flex', marginBottom: 2 }}>
    //   {/* <CardMedia
    //     component="img"
    //     sx={{ width: '20%' }}
    //     image= {require ("../assets/coursePlaceholder.jpg")}
    //     alt={course}
    //   /> */}
    //   <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
    //     <CardContent sx={{ flex: '2 0 auto' }}>
    //       <Typography component="div" variant="body1">
    //         {course}
    //       </Typography>
    //     </CardContent>
    //     <IconButton aria-label="remove">
    //         <RemoveCircleIcon color='#fefefe' onClick={handleClick}></RemoveCircleIcon>
    //     </IconButton>

    //   </Box>
    // </Card>

    <Button variant="outlined" sx={{marginBottom: 2, marginRight: 2}} endIcon={<RemoveCircleIcon />} onClick={handleClick}>
      {course}
    </Button>
  );
}

