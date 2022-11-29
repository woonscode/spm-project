import LJCard from './LJCard'
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
import { useNavigate, useParams, useLocation } from "react-router-dom"

export default function ViewLJ() {

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const  [lj, setLJ] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [refresh, setRefresh] = useState(false);

    const [displayLJ, setDisplayLJ] = useState([]);
    const staffId = localStorage.getItem("staffId")

    // First useEffect - only when page load
    useEffect(()=>{
        // Get the skills needed for selected role
        const getLJ = async () => {
            try {
                
                const response = await axios.get( `${url}viewlearningjourneys/${encodeURIComponent(staffId.trim())}`)
               
                if (response.data.data.learning_journeys.length == 0) {
                    setLJ([])
                    setDisplayLJ([])
                }
                else {
                    setLJ(response.data.data.learning_journeys)
                    setDisplayLJ(response.data.data.learning_journeys)
                }
            }
            catch(e) {
                
                alert("Axios Error")
            }
        }

        // Invoke api
        getLJ();
    },[refresh]);

    //Search for LJ
    useEffect(()=>{
        if (lj && lj.length){
        let filtered = lj.filter(i=>{
            return i.jobrole.toLowerCase().includes(searchInput.toLowerCase())
        })
       
        setDisplayLJ(filtered)
        } else {
        setDisplayLJ([])
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
                <Typography variant="h1" sx={{ pt: 3, mb:3 }}>My Learning Journeys</Typography>

                {/* Search component */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F3F3F3' }}
                    >

                    <InputBase
                        onChange={(e)=>{setSearchInput(e.target.value)}}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search learning journeys..."
                        value={searchInput}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* conditional rendering  */}
                    <Grid sx={{mt: 3}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                        {displayLJ.length>0?
                        displayLJ.map((lj, index) => {
                            return (
                            <Grid key={index} item xs={12} sm={12} md={6}>
                                <LJCard
                                    LJName={lj.jobrole}
                                    numCoursesCompleted={lj.courses_completed}
                                    ljid={lj.ljid}
                                    refresh={refresh}
                                    setRefresh={setRefresh}
                                />
                            </Grid>
                        )})
                        :
                        <Grid sx={{mx: 'auto'}}>
                            <Typography variant='body1'>No learning journeys created yet</Typography>
                        </Grid>
                        }
                    </Grid>
                </Container>
            </div>
    );
}