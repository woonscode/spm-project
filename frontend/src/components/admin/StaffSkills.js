import { useState } from 'react';
import axios from 'axios';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '32%',
    width: '30%',
    bgcolor: 'background.paper',
    border: '2px solid #223843',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
  };   

export default function StaffSkills ({refresh,setRefresh, staffId, skillsAcquired}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    
    const [roleSkills, setRoleSkills] = useState([]);
    // array of strings [' blah ', ' blah ', ' blah ']
    const [skills, setSkills] = useState([]);
    const [displaySkills, setDisplaySkills] = useState([]);
    const [addSkillsOption, setAddSkillsOption] = useState([]);
    const [newSkill, setNewSkill] = useState('')

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const skillCheck = (e) => {
        if (e.target.checked) {
            setRoleSkills([...roleSkills, e.target.value])
        } else {
            setRoleSkills(roleSkills.filter(skill => skill !== e.target.value))
        }
    }

    const handleSubmit = async () => {
        try{
            const response = await axios.post(`${url}addstaffskill`,{staffid: staffId.staffId, newskill: newSkill})

            if (response.status === 200) {
                setRefresh(!refresh)
                setTimeout(() => {setRefresh(!refresh)}, 1000)
                // clear and reset all states
                
                setRoleSkills([]);
                handleClose()
            }

        }catch(e){
            alert("Axios Error")
        }

        
    }

    // display all existing skills
    const getSkills = async () => {
        setOpen(true); 

        try{
            const response = await axios.get(`${url}skills`)
            let data = response.data.data.skills
            let formatted = []
            data.forEach((skill) =>
                formatted.push( {
                    "Skill_Name": skill.Skill_Name,
                    "Flag": skill.Flag === 1 ? <Button variant="contained" style={{backgroundColor:"green"}}>active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>
                })
            )
        
            setSkills(formatted)
            setDisplaySkills(formatted)

            // Add skills option should be only skills not in skillsAcquired
            let addSkills = []
            data.forEach((skill) => {
                if (!skillsAcquired.includes(skill.Skill_Name)) {
                    addSkills.push(skill)
                }
            })
            setAddSkillsOption(addSkills)

        }catch(e){
            console.log(e);
            alert("Axios Error")
        }
    }

    return ( 
        <div className="AddSkill">

        <Button onClick={getSkills} sx={{ padding: 1, mt: 3,  border: '1px solid', position: 'absolute', right: 1}}>Add Skills</Button>

        <Modal
                    open={open}
                    onClose={handleClose}
                    onClick={skillCheck}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={style} style={{minWidth: '300px'}}>
                        
                        <Box
                            sx={{
                                '& > :not(style)': { width: '100%' },
                            }}
                            noValidate
                            autoComplete="off"
                            >

                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add External Skill
                                </Typography>

                                <TextField id="outlined-basic" label="Enter skill name here" 
                                    sx = {{mb: 2, mt: 2}}
                                    // value = {newSkill}
                                    onChange = {(e) => setNewSkill(e.target.value)}
                                    variant="outlined" />    
                            </Box>

                            <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleClose}></CloseIcon>

                        <Button onClick={handleSubmit} variant="contained" color="primary" 
                        sx={{
                            color:"primary",
                            position: 'absolute',
                            bottom: '12%',
                            right:  '30px'
                            }}
                            size="medium">Save Edit</Button>

                    </Box>
                </Modal>
        </div>
     );
}
