import { useState } from 'react';
import axios from 'axios';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material/';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
  };

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function AddRole ({refresh,setRefresh}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [roleName, setRoleName] = useState('');
    const [roleStatus, setRoleStatus] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [roleSkills, setRoleSkills] = useState([]);
    // array of strings [' blah ', ' blah ', ' blah ']
    const [skills, setSkills] = useState([]);
    const [displaySkills, setDisplaySkills] = useState([]);

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const skillCheck = (e) => {
        if (e.target.checked) {
            setRoleSkills([...roleSkills, e.target.value])
        } else {
            setRoleSkills(roleSkills.filter(skill => skill !== e.target.value))
        }
    }

    const handleSubmit = async () => {
        // e.preventDefault();
        const role = { roleName, roleStatus, roleDescription, roleSkills };

        // TODO: make api call to backend to add role
        // if success, setRefresh to !refresh
        // if error, show error message as popup

        try{
            
            const response = await axios.post(`${url}createjobrole`,{jobrolename: roleName, jobroledesc: roleDescription, jobrolestatus: 1, relatedskills: roleSkills})
            

            if (response.status === 201) {
                setRefresh(!refresh)
                setTimeout(() => {setRefresh(!refresh)}, 1000)
                // clear and reset all states
                setRoleName('');
                setRoleStatus('');
                setRoleDescription('');
                setRoleSkills([]);
                handleClose()
            }

        }catch(e){
          
            alert("Axios Error")
        }


    }

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

        }catch(e){
      
            alert("Axios Error")
        }
    }

    return (
        <div className="AddRole">

        <Button onClick={getSkills} sx={{ padding: 1, mt: 3,  border: '1px solid', position: 'absolute', right: 1}}>Add New Role</Button>

        <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={style}>

                        <Box
                            sx={{
                                '& > :not(style)': {width: '100%' },
                            }}
                            noValidate
                            autoComplete="off"
                            >
                                {/* add role name */}
                                <Container sx={{maxHeight: "450px", mt: 3}}>
                                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1}} variant="h6" component="h2">
                                    Role Name
                                </Typography>

                                <TextField fullWidth id="outlined-basic" label="Enter role name here"
                                    // value = {newSkill}
                                onChange = {(e) => setRoleName(e.target.value)}
                                variant="outlined" />

                                {/* add role description */}

                                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1}} variant="h6" component="h2">
                                    Role Description
                                </Typography>

                                <TextField fullWidth
                                id="outlined-multiline-static"
                                label="Enter new role description here"
                                multiline
                                rows="3"
                                // defaultValue="No role description available"
                                variant="outlined"
                                onChange = {(e) => setRoleDescription(e.target.value)}
                                />

                                <Typography id="modal-modal-description" sx={{ mt: 2}} variant="h6" component="h2">
                                    Relevant Skills
                                </Typography>


                                <Grid container spacing={2} sx={{ overflowY: "scroll", maxHeight: "150px", mt:1 }}>

                                    {displaySkills.map(values => (

                                            <Grid key={values.Skill_Name} item xs={6} sm={4}>

                                                    <Checkbox sx={{padding: 0, paddingRight: 1}}

                                                    onClick={skillCheck}
                                                    value = {values.Skill_Name}

                                                    />{values.Skill_Name}

                                            </Grid>


                                            ))}
                                </Grid>
                                </Container>
                            </Box>

                        <Button 
                        // disabled={roleName === '' || roleDescription === '' || roleSkills.length === 0}
                        disabled={roleName === ''}
                        onClick={handleSubmit} variant="contained" color="primary" sx={{mx: '6px',
                        color:"primary",
                        position: 'absolute',
                        bottom: '40px',
                        right:  '40px'
                        }}
                        size="large">Add Role</Button>

                        <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleClose}></CloseIcon>

                    </Box>
                </Modal>
        </div>
     );
}