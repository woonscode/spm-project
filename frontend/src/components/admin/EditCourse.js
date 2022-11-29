// NEED TO ADD IN NEW SKILL NAME

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import axios from 'axios';
import {useState, useEffect} from 'react';


export default function EditCourse ({handleSubmit, openEdit, setOpenEdit, saveEdit, newCourseSkills, setNewCourseSkills, courseSkills}) {

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [skillsOption,setSkillsOption] = useState([]);

    const skillCheck = (e) => {
        if (e.target.checked) {
            setNewCourseSkills([...newCourseSkills, e.target.value])
        } else {
            setNewCourseSkills(newCourseSkills.filter(skill => skill !== e.target.value))
        }
    }

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
        borderRadius: 5,
        minWidth: '400px'
      };

    const saveEditDetails = async () => {
        setOpenEdit(true);
    }

    const getSkills = async () => {

        try{
            const response = await axios.get(`${url}skills`)
            let data = response.data.data.skills
            let formatted = []
            data.forEach((skill) =>
                formatted.push(skill.Skill_Name)
            )
            setSkillsOption(formatted)

        }catch(e){
            console.log("Axios Error");
            // alert("Axios Error")
        }
    }

    useEffect(() => {
        getSkills()
    },[])

    return(
        <div className = "EditCourse">
            <Button onClick={saveEditDetails} variant="contained" color="primary" sx={{mx: '6px',
                            color:"primary",
                            position: 'absolute',
                            bottom: '40px',
                            right:  '40px'
                            }}
                            size="large">Edit Details</Button>

            <Modal

                open={openEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>

                        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Course Skills
                        </Typography>
                    {/* Update Role Skills */}
                    <Grid container spacing={2} sx={{ overflowY: "scroll", height: '340px'}}>
                        {/* <Grid item xs={12} sm={12}> */}

                        {
                            skillsOption && skillsOption.length?
                            skillsOption.map(skillName => (

                                <Grid key={skillName} item xs={6} sm={4}>

                                        <Checkbox sx={{padding: 0, paddingRight: 1}}

                                        onClick={skillCheck}
                                        value = {skillName}
                                        checked={newCourseSkills && newCourseSkills.includes(skillName) ? true : false}

                                        />{skillName}

                                </Grid>

                                ))
                            : null
                        }
                        {/* </Grid> */}
                    </Grid>

                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{mx: '6px',
                            color:"primary",
                            position: 'absolute',
                            bottom: '40px',
                            right:  '20px'
                            }}
                            size="large">Save Edits</Button>

                    
                </Box>
            </Modal>
        </div>
    )
}
