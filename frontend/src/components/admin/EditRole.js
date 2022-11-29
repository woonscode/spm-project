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
import Container from '@mui/material/Container';



export default function EditRole ({handleSubmit, openEdit, setOpenEdit, roleName, flag, newRoleStatus, setNewRoleStatus, saveEdit, newRole, setNewRole, newRoleDescription, setNewRoleDescription, newRoleSkills, setNewRoleSkills,roleSkills}) {

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [skillsOption,setSkillsOption] = useState([]);


    const skillCheck = (e) => {
        if (e.target.checked) {
            setNewRoleSkills([...newRoleSkills, e.target.value])
        } else {
            setNewRoleSkills(newRoleSkills.filter(skill => skill !== e.target.value))
        }
    }

    const changeStatus = (event) => {
        setNewRoleStatus(event.target.value);
    };

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
        }
    }

    useEffect(() => {
        getSkills()
    },[])

    return(
        <div className = "EditRole">
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
                        <Container sx={{overflowY: "scroll", height: '85%'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={9}>
                                    {/* change role name */}
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6" component="h2">
                                    Current Role: {newRole}
                                    </Typography>

                                    <TextField fullWidth sx={{ mt: 1, mb: 0}} id="outlined-basic" label="Enter role name here"
                                    // value = {newSkill}
                                    onChange = {(e) => setNewRole(e.target.value)}
                                    variant="outlined" />

                                </Grid>


                                <Grid item xs={12} sm={12} md={3}>
                                    {/* change role status */}
                                    <Typography id="modal-modal-description"  variant="h6" component="h2" sx={{mt:2}}>
                                    Status
                                    </Typography>

                                    <FormControl fullWidth sx={{ mt: 1 }}>

                                    <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            id="status"
                                            value={newRoleStatus}
                                            label="Status"
                                            onChange={changeStatus}
                                            style={{width: '100%'}}
                                        >
                                            <MenuItem value={0}>Inactive</MenuItem>
                                            <MenuItem value={1}>Active</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* change role description */}
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12}>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6" component="h2">
                                        Role description
                                    </Typography>

                                    <p>{newRoleDescription}</p>

                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Enter new role description here"
                                        multiline
                                        rows="3"
                                        fullWidth
                                        onChange = {(e) => setNewRoleDescription(e.target.value)}
                                        variant="outlined"
                                    />

                                </Grid>
                            </Grid>
                            <Typography id="modal-modal-description" sx={{ my: 2 }} variant="h6" component="h2">
                                Role Skills
                            </Typography>
                            {/* Update Role Skills */}
                            <Grid container spacing={2} sx={{ overflowY: "scroll", height: "35%" }}>
                                {/* <Grid item xs={12} sm={12}> */}

                                {
                                    skillsOption && skillsOption.length?
                                    skillsOption.map(skillName => (

                                        <Grid key={skillName} item xs={6} sm={4}>

                                                <Checkbox sx={{padding: 0, paddingRight: 1}}

                                                onClick={skillCheck}
                                                value = {skillName}
                                                checked={newRoleSkills && newRoleSkills.includes(skillName) ? true : false}

                                                />{skillName}

                                        </Grid>


                                        ))
                                    : null
                                }
                                {/* </Grid> */}
                            </Grid>
                        </Container>

                            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{mx: '6px',
                            color:"primary",
                            position: 'absolute',
                            bottom: '40px',
                            right:  '40px'
                            }}
                            size="large">Save Edits</Button>
                            
                </Box>
            </Modal>
        </div>
    )
}