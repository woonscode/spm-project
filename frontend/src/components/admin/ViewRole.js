// NEED TO ADD IN NEW SKILL NAME

import { useEffect, useState } from 'react';
import axios from 'axios';

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
import CloseIcon from '@mui/icons-material/Close';

import EditRole from './EditRole'

export default function ViewRole ({roleName, refresh, setRefresh, flag, roleDescription}) {
    const [openRole, setOpenRole] = useState(false);
    // const handleOpenRole = () => setOpenRole(true);
    const handleCloseRole = () => setOpenRole(false);

    const [newRole, setNewRole] = useState(roleName);
    const [newRoleStatus, setNewRoleStatus] = useState(flag.props.children==="active"?1:0);
    const [newRoleDescription, setNewRoleDescription] = useState(roleDescription);

    const [roleSkills, setRoleSkills] = useState([])

    const [newRoleSkills, setNewRoleSkills] = useState();

    const [openEdit, setOpenEdit] = useState(false);

    const [updatedRoleName, setUpdatedRoleName] = useState(roleName);
    const [updatedRoleDescription, setUpdatedRoleDescription] = useState(roleDescription);

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

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

    const handleOpenRole = async () => {
        setOpenRole(true);
        try{
            const response = await axios.get(`${url}jobroledetails/${encodeURIComponent(updatedRoleName.trim())}`)
   
            let data = response.data.data.skills
  
            setRoleSkills(data)
            setNewRoleSkills(data)

        }catch(e){
       
            alert("Axios Error")
        }
    }
    useEffect(() => {
        if(openRole){
            handleOpenRole();
        }
    }, [updatedRoleName,refresh])

    const handleSubmit = async () => {
        setOpenEdit(false);
  
        try{
            const response = await axios.post(`${url}editjobrole/${encodeURIComponent(roleName.trim())}`,{newjobrolename: newRole, newdesc: newRoleDescription, status: newRoleStatus, relatedskills: newRoleSkills})

            if (response.status === 200) {
                setUpdatedRoleName(newRole)
                setUpdatedRoleDescription(newRoleDescription)
                setRefresh(!refresh)
            }

        }catch(e){
      
            alert("Axios Error")
        }
        

    }

    const saveEdit = (event) => {
      
        setNewRoleStatus(event.target.value);
      };


    return(
        <div className = "ViewRole">
            <Button onClick={handleOpenRole} variant="contained" color="primary" size="small" sx={{ mr: 1}}>View Details</Button>

            <Modal
                
                open={openRole}
                onClose={handleCloseRole}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h1" component="h2">
                            {updatedRoleName}
                        </Typography>
                    
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Status: {newRoleStatus===1?"Active":"Inactive"}
                        </Typography>
                        
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Role Description
                        </Typography>
                        <p>{updatedRoleDescription}</p>

                        

                        <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Skills Acquired
                        </Typography>

                        
                        <p>
                        {roleSkills.map(skillName => (  
                            <li key={skillName}>  
                                {skillName}  
                            </li>  
                            ))}  
                        </p>

                        

                        <EditRole
                            handleSubmit = {handleSubmit}
                            openEdit = {openEdit}
                            setOpenEdit = {setOpenEdit}
                            roleName = {updatedRoleName}
                            setNewRole = {setNewRole} //
                            flag = {flag}
                            newRoleStatus = {newRoleStatus}
                            setNewRoleStatus = {setNewRoleStatus}
                            saveEdit = {saveEdit}
                            roleDescription = {updatedRoleDescription}
                            setNewRoleDescription = {setNewRoleDescription} //
                            newRole = {newRole}
                            newRoleDescription = {newRoleDescription}
                            newRoleSkills = {newRoleSkills}
                            setNewRoleSkills = {setNewRoleSkills}
                            roleSkills = {roleSkills}
                        />

                    <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleCloseRole}></CloseIcon>
                </Box>
            </Modal>
        </div>
    )
}