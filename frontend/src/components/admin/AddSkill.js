import { useState } from 'react';
import axios from 'axios';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '32%',
    width: '30%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
  };

export default function AddSkill ({refresh,setRefresh}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [skillName, setSkillName] = useState('');
    
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const handleSubmit = async () => {
        // e.preventDefault();
        const skill = { skillName };
        
        try{
            const response = await axios.post(`${url}skills/${encodeURIComponent(skillName.trim())}`,{Flag:1})
            
            if (response.status === 201) {
                setRefresh(!refresh)
                handleClose()
            }

        }catch(e){
            
            alert("Axios Error")
        }
        
    }

    return ( 
        <div className="AddSkill">

        <Button onClick={handleOpen} sx={{ padding: 1, mt: 3,  border: '1px solid', position: 'absolute', right: 1}}>Add New Skill</Button>

        <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={style} style={{minWidth: '300px'}}>
                        
                        <Box
                            sx={{
                                '& > :not(style)': { width: '100%'},
                            }}
                            noValidate
                            autoComplete="off"
                            >
                            
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add a new skill
                                </Typography>
                                

                                <TextField id="outlined-basic" label="Enter skill name here" 
                                    sx = {{mb: 2, mt: 2}}
                                    // value = {newSkill}
                                    onChange = {(e) => setSkillName(e.target.value)}
                                    variant="outlined" />

                            </Box>

                            <Button onClick={handleSubmit} variant="contained" color="primary" 
                            sx={{
                            color:"primary",
                            position: 'absolute',
                            bottom: '12%',
                            right:  '30px'
                            }}
                            size="medium">Add Skill</Button>

                            <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleClose}></CloseIcon>
                    </Box>
                </Modal>
        </div>
     );
}
