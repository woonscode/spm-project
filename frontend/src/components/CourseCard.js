import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia }from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import CourseButton from './CourseBtn';

import axios from 'axios';
import {useState, useEffect } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
};

export default function CourseCard({courseName, selectedCourses, setSelectedCourses, attainedSkills, setAttainedSkills, setMessage, message}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const  [course, setCourseInfo] = useState([]);
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


    const updateCourseSelection = (course) => {
        if (selectedCourses.length && selectedCourses.includes(course)){
         
            let newArr = selectedCourses.filter((i)=>{return i!==course})
       
            setSelectedCourses(newArr);
            removeSkillsAttained();
        }else{
            setSelectedCourses([...selectedCourses,course])
            addSkillsAttained();
        }
    }

    const handleClick = (course) => {
        handleClose(true);
        updateCourseSelection(courseName);
    }

    useEffect(()=>{
        // Define Async function to query getSkills API for a job role
        const getCourseInfo = async () => {
            try {
               
                const response = await axios.get( `${url}course/${encodeURIComponent(courseName.trim())}`)
           
                setCourseInfo(response.data.data.courses)

                // Get the skills attainable from course
                const response2 = await axios.get( `${url}findfilteredskillswithcourse/${encodeURIComponent(courseName.trim())}`)
               
                setCourseSkills(response2.data.data.skills)

            } catch(e) {
        
                alert("Axios Error")
            }
        }

        // Invoke api
        getCourseInfo();
    },[selectedCourses])

        return (
          <Card variant='outlined' sx={{ minWidth: '40%', height: '100%'}}>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >

              <Box sx={style}>
                  <Typography variant="h1">
                      {courseName}
                  </Typography>

                  <Typography id="modal-modal-description" variant="body1" sx={{ mt: 3 }}>
                      {course.length && course[0].Course_Desc}
                  </Typography>

                  <Typography variant="h2" sx={{mt: 3}}>
                      Skills Required:
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    flexWrap: 'wrap',
                    listStyle: 'none',

                    p: 0,
                }} component="ul">
                    {courseSkills.length>0 ?
                    courseSkills.map((skill, index) => {
                        return (
                            <ListItem key = {index}>
                            <Chip
                                color="secondary"
                                label={skill}
                                sx={{
                                    height: 20,
                                    fontSize: '0.75rem',
                                    margin: 0
                                }}
                            />
                            </ListItem>
                        )} ) : null
                    }
                </Box>

                  <Button variant="contained" primary
                    sx={{mx: '6px',
                    color:"primary",
                    position: 'absolute',
                    bottom: '40px',
                    right:  '40px'
                    }}
                    size="large"
                        onClick={handleClick}
                    >Add to Learning Journey</Button>

                  <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleClose}></CloseIcon>
              </Box>
          </Modal>

              <CardMedia
                  component="img"
                  alt="courseImg"
                  height="140"
                  image= {require ("../assets/coursePlaceholder.jpg")}
                />

          <CardContent sx={{p: 1}}>
            <Typography variant="body1">
            {courseName}
            </Typography>

            <Box sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0,
                    margin: 0
                }} component="ul">
                    {courseSkills.length>0 ?
                    courseSkills.map((skill, index) => {
                        return (
                            <ListItem key = {index}>
                            <Chip
                                color="secondary"
                                label={skill}
                                sx={{
                                    height: 20,
                                    fontSize: '0.75rem',
                                    margin: 0
                                }}
                            />
                            </ListItem>
                        )} ) : null
                    }
                </Box>

        </CardContent>

        <CardActions sx={{p:0}}>
            <Button sx={{mx: '6px'}} size="small" onClick={handleOpen}>View description</Button>
        </CardActions>
    </Card>

    );
 }