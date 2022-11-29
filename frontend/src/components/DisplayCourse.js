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

export default function DisplayCourse({courseName, courseDesc, isCompleted}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [skills, setSkills] = useState([]);

    // Second useEffect - only when page load
    useEffect(()=>{
        // Define Async function to query getSkills API for a course
        const getSkills = async () => {
            try {
                
                const response = await axios.get( `${url}findfilteredskillswithcourse/${encodeURIComponent(courseName.trim())}`)
                console.log(response.data.data.skills)
                setSkills(response.data.data.skills)
            } catch(e) {
                console.log(e);
                alert("Axios Error")
            }
        }

        // Invoke api
        getSkills();
        },[])


        return (
          <Card variant='outlined' sx={{ minWidth: '40%', height: 300 }}>
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
                      {courseDesc}
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
                    {skills.length>0 ?
                    skills.map((skill, index) => {
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
                    margin: 0,
                    p: 0,
                }} component="ul">
                    {skills.length>0 ?
                    skills.map((skill, index) => {
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

                {isCompleted === "Completed" ? (
                    <Chip
                        color="success"
                        label="Completed"
                        sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            margin: 0
                    }}
                    />
                ):
                (<Chip
                    label="Not completed"
                    sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        margin: 0,
                        backgroundColor: "#eff1f3"
                }}
                />)
                }


        </CardContent>

        <CardActions sx={{p: 0}}>
        <Button sx={{mx: '6px'}} size="small" onClick={handleOpen}>View description</Button>
        </CardActions>
    </Card>

    );
 }