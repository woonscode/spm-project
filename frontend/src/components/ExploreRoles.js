import RoleCard from './RoleCard'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import axios from 'axios';
import {useState, useEffect } from 'react';

export default function ExploreRoles() {

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const  [roles, setRoles] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const  [displayRoles, setDisplayRoles] = useState([]);

    // First useEffect - only when page load
    useEffect(()=>{
        // Define Async function to query getSkills API for a job role
        const getRoles = async () => {
            try {
               
                const response = await axios.get(`${url}get_filtered_jobrole_with_skills`)
               
                setRoles(response.data.jobroles)
                setDisplayRoles(response.data.jobroles)
            }catch(e) {
                console.log(e);
                alert("Axios Error")
            }
        }

        // Invoke api
        getRoles();
        },[])


        useEffect(()=>{

        if (roles && roles.length){
            let filtered = roles.filter(i=>{
                return i.Job_Role_Name.toLowerCase().includes(searchInput.toLowerCase())
            })

            setDisplayRoles(filtered)
            } else {
            setDisplayRoles([])
            }
            },[searchInput])

        const tile = {
            width: '100%',
            backgroundColor: 'white',
            paddingBottom: '50px',
            borderRadius: '20px'
        };

    return (
        <div style={tile}>
            <Container>
                <Typography variant="h1" sx={{ pt: 3, mb:3 }}>Explore Roles</Typography>

                {/* Search component */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F3F3F3' }}
                    >

                    <InputBase
                        onChange={(e)=>{setSearchInput(e.target.value)}}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search roles..."
                        value={searchInput}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* conditional rendering  */}
                    <Grid sx={{mt: 3}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                        {displayRoles.length>0?
                        displayRoles.map((role, index) => {
                            return (
                            <Grid key={index} item xs={12} sm={12} md={6}>
                                <RoleCard
                                    roleName={role.Job_Role_Name}
                                    roleDescription={role.Job_Role_Description}
                                    skills={role.skills}
                                />
                            </Grid>
                        )})
                        :<Typography variant="body1" sx={{mx: 2, py: 2, textAlign: 'center', width:'100%'}}>No Roles Found</Typography>
                        }
                    </Grid>
                </Container>
            </div>
    );
}