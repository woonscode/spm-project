import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState, useEffect } from 'react';

import CourseButton from './CourseBtn';

import SkillButton from './SkillBtn'

  const Tile = styled('div')(({ theme }) => ({
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: '50px',
    borderRadius: '20px',
    minHeight: '100%'
    }));

export default function Summary({selectedCourses,setSelectedCourses, attainedSkills, setAttainedSkills, handleClick}){
    const [message, setMessage] = useState("disabled");

    useEffect(()=>{
        // Manage the disabled button when no courses are selected
        const manageBtn = () => {
            if (selectedCourses.length > 0){
                setMessage("");
                
            }
            else {
                setMessage("disabled");
                
            }
        }

        manageBtn();
    },[selectedCourses, message])

    return(
        <Tile>
            <Container>
                <Box sx={{mb: 5}}>
                    <Typography variant="h1" color="primary" sx={{ pt: 3, mb:3 }}>Learning Journey Summary</Typography>
                    {/* courses */}
                    <Typography variant="h2" color="primary" sx={{ mb:1 }}>Selected Courses</Typography>
                    {
                        selectedCourses.length > 0 ?
                        selectedCourses.map((val,i)=>{
                            return (
                                <CourseButton
                                variant="contained"
                                course={val}
                                key={i}
                                setSelectedCourses={setSelectedCourses}
                                selectedCourses={selectedCourses}
                                attainedSkills={attainedSkills}
                                setAttainedSkills={setAttainedSkills}
                                ></CourseButton>
                            )

                        })
                            :
                            <p style={{fontStyle: 'italic', color: ''}}>No courses added to learning journey</p>
                        }
                </Box>

                {/* skills */}
                <Box sx={{mb: 5}}>
                    <Typography variant="h2" color="primary" sx={{ mb:1 }}>Acquired Skills</Typography>
                        {
                            // attainedSkills.length > 0 ?
                            // attainedSkills.map((val,i)=>{
                            //     return (
                            //         <SkillButton
                            //         key={i}
                            //         name={val}
                            //         setSelectedSkills={null}
                            //         selectedSkills={null}
                            //         type={"Immutable"}
                            //         ></SkillButton>
                            //     )
                            // })
                            Object.keys(attainedSkills).length > 0 ?
                            Object.keys(attainedSkills).map((val,i)=>{
                                return (
                                    <SkillButton
                                    key={i}
                                    name={val}
                                    setSelectedSkills={null}
                                    selectedSkills={null}
                                    type={"Immutable"}
                                    ></SkillButton>
                                )
                            })
                            :
                            <p style={{fontStyle: 'italic', color: ''}}>No skills acquired</p>
                        }
                    </Box>

                    {message === "disabled" ?
                    <Button variant="contained" primary
                        sx={{mx: '6px',
                            width:'100%',
                            }}
                            size="large"
                            disabled
                    >Save Learning Journey</Button>
                    :
                    <Button variant="contained" primary
                        sx={{mx: '6px',
                            width:'100%',
                            }}
                            size="large"
                            onClick={handleClick}
                    >Save Learning Journey</Button>
                    }

            </Container>
        </Tile>
    )
}