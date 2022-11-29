import * as React from 'react';
import { Card, CardActions, CardContent, CardHeader, CardMedia }from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import LearningJourney from './LearningJourney'

import axios from 'axios';
import {useState, useEffect } from 'react';

import {
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

export default function RoleCard({roleName, roleDescription, skills}) {

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    // const  [skills, setSkills] = useState([]);
    const [message, setMessage] = useState("");


        // const  [lj, setLJ] = useState([]);
        const staffId = localStorage.getItem("staffId");

        const checkLJ = async () => {
            try {
            
                const response = await axios.get( `${url}viewlearningjourneys/${encodeURIComponent(staffId.trim())}`)
                const lj = response.data.data.learning_journeys

                if (lj && lj.length) {
                    for (let i=0; i<lj.length; i++) {
                        if (lj[i].jobrole === roleName) {
                            setMessage("disabled")
                        }
                    }
                }
                else {
                    setMessage("")
                }
            }
            catch(e) {
           
                alert("Axios Error")
            }
        }

        const navigate = useNavigate();
        const handleClick = () => {
            navigate(`/CreateLearningJourney/${encodeURIComponent(roleName.trim())}`);
        }

        const ListItem = styled('li')(({ theme }) => ({
            margin: theme.spacing(0.5),
        }));

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        checkLJ()
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    return (
    <Card variant='outlined' sx={{ minWidth: '40%', height: 200 }}>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >

            <Box sx={style}>
                <Typography variant="h1">
                    {roleName}
                </Typography>

                <Typography id="modal-modal-description" variant="body1" sx={{ mt: 3 }}>
                    {roleDescription}
                </Typography>

                {skills && skills.length > 0 ?
                <>
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
                    {skills.map((skill, index) => {
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
                        )})
                    }
                </Box>
                </>: null}

                {message === "disabled" ?
                    <Button variant="contained"
                        sx={{mx: '6px',
                            color:"primary",
                            position: 'absolute',
                            bottom: '40px',
                            right:  '20px'
                            }}
                            size="large"
                            disabled
                    >Create Learning Journey</Button>
                    :
                    <Button variant="contained"
                        sx={{mx: '6px',
                            color:"primary",
                            position: 'absolute',
                            bottom: '40px',
                            right:  '20px'
                            }}
                            size="large"
                            onClick={handleClick}
                    >Create Learning Journey</Button>
                    }

                <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleClose}></CloseIcon>
            </Box>
        </Modal>

        <Box
            sx={{
            mt: 2,
            mb: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'start'
            }}
        >
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
            <Typography variant="body1">
            {roleName}
            </Typography>
        </Box>

        <CardContent sx={{p: 0}}>

            <Box sx={{
                display: 'flex',
                justifyContent: 'start',
                flexWrap: 'wrap',
                listStyle: 'none',
                mx: '6px',
                p: 0,
            }} component="ul">
                {skills.map((skill, index) => {
                    return (
                        <ListItem key = {index}>
                        <Chip
                            color="secondary"
                            label={skill}
                            sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                margin: 0
                            }}
                        />
                        </ListItem>
                    )})
                }
            </Box>



        </CardContent>

        <CardActions sx={{p: 0}}>
        <Button sx={{mx: '6px',}} size="small" onClick={handleOpen}>View description</Button>
        </CardActions>
    </Card>
    );
    }