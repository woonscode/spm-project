import LJCard from './LJCard'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import SkillButton from './SkillBtn'
import CourseCard from './CourseCard'
import DisplayCourse from './DisplayCourse'
import usePagination from '@mui/material/usePagination/usePagination';

import axios from 'axios';
import {useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function ManageLJ() {

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [ljDetails, setLjDetails] = useState([])

    // First useEffect - only when page load
    useEffect(()=>{
        // Get the details for the specific learning journey
        const getLJDetails = async () => {
            try {
               
                const response = await axios.get(`${url}viewlearningjourneydetail/${ljid}`)
               
                setLjDetails(response.data.data)
            }catch(e) {
      
                alert("Axios Error")
            }
        }
        // Invoke api
        getLJDetails();
    },[])

    const navigate = useNavigate();

    const handleDeleteLJ = async () => {
        
        try {
           
            await axios.get( `${url}deletelearningjourney/${encodeURIComponent(ljid)}`)
            navigate(`/LearningJourney`);
        }catch(e) {
            
            alert("Axios Error")
        }
    }

    const handleEditLJ = async () => {
      
        try {

            const response = await axios.get(`${url}viewlearningjourneydetail/${ljid}`)
            const roleName = response.data.data.jobrole

            navigate(`/CreateLearningJourney/${encodeURIComponent(roleName.trim())}`, {
                state: {
                    ljid: ljid
                }
            })

        }catch(e) {
     
            alert("Axios Error")
        }
    }

    // using the parameters passed in from display ljs
    const { state } = useLocation();
    const ljid = state.ljid

    const tile = {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '50px',
        borderRadius: '20px',
        minHeight: '100%'
    };

    return (
        <div style={tile}>
            <Container>
                <Box>
                    <Typography sx={{pt:3}}variant="h1" color="primary">{ljDetails.jobrole} Learning Journey</Typography>
                    <Stack direction="row" spacing={2} sx={{pt:3}}>
                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleDeleteLJ}>
                            Delete
                        </Button>
                        <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditLJ}>
                            Edit
                        </Button>
                    </Stack>

                    <Typography variant="h2" color="primary" sx={{ pt: 3 }}>Courses Completed</Typography>
                    <Chip secondary
                            label={state.numCoursesCompleted}
                            sx={{
                                height: 20,
                                fontSize: '1rem',
                                marginTop: 2,
                                marginBottom: 4,
                                backgroundColor: '#FFD37E',
                                padding: 2,
                                borderRadius: 1,
                            }}
                        />
                </Box>

                <Divider/>

                <Box sx={{mb: 5}}>
                    <Typography variant="h2" color="primary" sx={{ pt: 3 }}>Courses Selected</Typography>

                    <Grid sx={{mt: 3}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                    {ljDetails.all_courses&&
                    ljDetails.all_courses.length?
                    ljDetails.all_courses.map((course, index)=>{
                        return(
                            <Grid key={index} item xs={12} sm={6} md={6}>
                                <DisplayCourse
                                courseName={course.Course_Name}
                                courseDesc={course.Course_Desc}
                                isCompleted={course.completed}
                                />
                            </Grid>
                            )}): null
                        }
                    </Grid>



                </Box>

                <Box sx={{mb: 5}}>
                    <Typography variant="h2" color="primary" sx={{ pt: 3, mb:3 }}>Skills Obtained</Typography>
                    {
                        ljDetails.all_skills &&  ljDetails.all_skills.length > 0?
                        ljDetails.all_skills.map((skill,i)=>{
                            return (
                               <button
                                style={{
                                    border: '1px solid #d77a61', borderRadius: '5px',
                                    padding: 10, margin: 5,
                                    backgroundColor: 'white',
                                    color: '#d77a61'
                                }}
                            >
                                {skill}
                            </button>
                            )
                        })
                        :
                        null
                    }
                </Box>

                </Container>
            </div>

    );
}