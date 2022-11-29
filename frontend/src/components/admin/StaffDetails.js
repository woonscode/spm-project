// react
import React from 'react'
import { useParams } from "react-router-dom"
import { useEffect, useState } from 'react';

// import from material ui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';

// axios
import axios from 'axios';

// import from components
import StaffSkills from './StaffSkills';

export default function StaffDetails() {
    const params = useParams();
    const staffId = params.id

    const [courses, setCourses] = useState([]);
    const [skills, setSkills] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const tile = {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '50px',
        borderRadius: '20px'
    };

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    useEffect(() => {
        const getCourses = async () => {
            try {
                const response = await axios.get(`${url}coursedonebystaff/${staffId}`)
                let data = response.data.courses
                setCourses(data)

            } catch (e) {
                console.log(e);
            }
        }
        const getSkills = async () => {
            try {
                const response = await axios.get(`${url}skillsofstaff/${staffId}`)
                let data = response.data.skills
                setSkills(data)

            } catch (e) {
                console.log(e);
            }
        }
        if (staffId) {
            getCourses()
            getSkills()
        }
    }, [refresh])


    return (
        <div className="viewStaff" style={tile}>
            <Container>

                <Grid sx={{mt: 3, position: 'relative'}} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                    <Grid item xs={6} padding-top='20px'>
                        <Typography variant="h1" sx={{ pt: 3, mb:3 }}>Staff {staffId}</Typography>
                    </Grid>
                    <Grid item xs={6} padding-top='20px'>
                        {JSON.parse(localStorage.getItem("role")) === "Admin"?
                            <StaffSkills
                            refresh = {refresh}
                            setRefresh = {setRefresh}
                            staffId = {{staffId}}
                            skillsAcquired={skills}
                            />
                        : null}

                    </Grid>


                    <Grid item xs={12} padding-top='20px'>
                        <Typography variant="h2" color="primary" sx={{ mb:3 }}>Courses Completed</Typography>
                    </Grid>

                </Grid>

                {/* completed courses */}

                <div>
                    <Grid container spacing={1}>
                    {courses.length ? courses.map(course => {
                        return (

                                <Grid item xs={12} sm={6} md={4} key={course.Course_ID}>

                                    <Card variant='outlined' sx={{margin: 1, height: '100%'}}>

                                        <CardMedia
                                        component="img"
                                        alt="courseImg"
                                        height="140"
                                        image= {require ("../../assets/coursePlaceholder.jpg")}
                                        />

                                        <CardContent sx={{p: 1}}>
                                            <Typography variant="body1">
                                                {course.Course_Name}
                                            </Typography>
                                        </CardContent>

                                    </Card>
                                </Grid>
                            )
                        })
                        : <Typography variant="body1" sx={{marginLeft: 1}}>No courses completed</Typography>
                        }
                </Grid>
                </div>

                {/* skills */}

                <div>
                    <Typography variant="h2" color="primary" sx={{ mb:3, mt: 4}}>Skills Acquired</Typography>
                    <Grid container spacing={1}>
                    {skills.length ? skills.map((skill) => {
                        return(
                            <Typography variant="body1" sx={{marginLeft: 1}} key={skill}>{skill}</Typography>,
                            <button
                                key={skill}
                                style={{
                                    border: '1px solid #d77a61', borderRadius: '5px',
                                    padding: 10, margin: 5,
                                    backgroundColor: 'white',
                                    color: '#d77a61',
                                }}
                            >
                                {skill}
                            </button>
                        )}): <Typography variant="body1" sx={{marginLeft: 1}}>No skills acquired</Typography>}
                    </Grid>
                </div>

            </Container>
        </div>
    )
}

