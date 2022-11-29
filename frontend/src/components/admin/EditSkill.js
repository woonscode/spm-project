// NEED TO ADD IN NEW SKILL NAME

import { useState } from 'react';
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

export default function EditSkill ({skillName, refresh, setRefresh, flag}) {
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    
    const [newSkill, setNewSkill] = useState(skillName);
    const [newStatus, setNewStatus] = useState(flag.props.children==="active"?1:0);

    const handleChange3 = (event) => {
        setNewStatus(event.target.value);
        
      };

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #223843',
        boxShadow: 24,
        p: 4,
        borderRadius: 5
      };

    const handleSubmit = async () => {

        try{
            const response = await axios.post(`${url}updateskill/${encodeURIComponent(skillName.trim())}`,{Skillname: newSkill, Flag:newStatus})

            if (response.status === 201) {
                setRefresh(!refresh)
                setNewSkill(newSkill)
                handleClose2()
            }

        }catch(e){
            alert("Axios Error")
        }
        
    }

    return(
        <div className = "EditSkill">
            <Button onClick={handleOpen2} variant="contained" color="primary" size="small" sx={{ mr: 1 }}>Edit</Button>

            <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        
                        <Grid container spacing={2}>
                            <Grid item xs={6} style={{padding: 0}}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                Edit {newSkill}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{padding: 0}}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        id="status"
                                        value={newStatus}
                                        label="Status"
                                        onChange={handleChange3}
                                        style={{width: '100%'}}
                                    >
                                        <MenuItem value={0}>Inactive</MenuItem>
                                        <MenuItem value={1}>Active</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>



                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6" component="h2">
                         {skillName}
                        </Typography> */}

                        <TextField id="outlined-basic" label="Enter skill name here" 
                        // value = {newSkill}
                        onChange = {(e) => setNewSkill(e.target.value)}
                        variant="outlined" />

                        <Button onClick = {handleSubmit} variant="contained" color="primary" >Save Edit</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}