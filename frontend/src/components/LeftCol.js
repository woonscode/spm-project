import * as React from 'react';
import {useState} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import SkillButton from './SkillBtn';
import CustomizedInputBase from './SearchCourse.js'

const Tile = styled('div')(({ theme }) => ({
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: '50px',
    borderRadius: '20px',
    minHeight: '100%'
}));

export default function LeftCol({
    skills, selectedSkills, setSelectedSkills,role,courses, setSelectedCourses, selectedCourses, attainedSkills, setAttainedSkills
}){

    return(
        <Tile>
            <Container>
                <Typography variant="h1" color="primary" sx={{ pt: 3, mb:3 }}>{role}</Typography>
                <Typography variant="h2" color="primary" sx={{ mb: 2}}>Relevant Skills</Typography>
                <Grid container spacing={1}>
                    {skills.length>0?
                        skills.map((s,index)=>{
                            return(
                            <Grid key={index} item xs={6} md={4}>
                                <SkillButton
                                name={s}
                                setSelectedSkills={setSelectedSkills}
                                selectedSkills={selectedSkills}
                                type={"Mutable"}
                                />
                            </Grid>
                            )
                        })
                    :
                    null
                    }
                </Grid>

                <Typography variant="h2" color="primary" sx={{ pt: 2, mb:1 }}>Create Your Own Learning Journey</Typography>
                <Typography variant="body1">Select the skill(s) you want to learn to view the relevant courses. Choose courses from the list below to curate your own learning journey path! You can only create a learning journey when all the courses fulfil the skills required for the job role.</Typography>

                <Typography variant="h2" color="primary" sx={{ pt: 3, mb:3 }}>Relevant Courses</Typography>
                <CustomizedInputBase
                    courses={courses}
                    selectedSkills={selectedSkills}
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                    attainedSkills={attainedSkills}
                    setAttainedSkills={setAttainedSkills}
                />

            </Container>
        </Tile>

    )
}