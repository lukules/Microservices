import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, InputAdornment, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import { AccountCircle, Email, Phone, Cake, Lock, Person } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastStyles.css';

const RegisterForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [userData, setUserData] = useState({
        phone: '',
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleNext = () => {
        if (activeStep < 2) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (prop) => (event) => {
        setUserData({ ...userData, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Sprawdź, czy hasła są takie same
        if (userData.password !== userData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
    
        // Usuń confirmPassword z danych wysyłanych do serwera
        const { confirmPassword, ...dataToSend } = userData;
    
        console.log(JSON.stringify(dataToSend))
        console.log(dataToSend.firstName);
        fetch('http://localhost:5002/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    const steps = [
        'Phone Number',
        'Personal Details',
        'Account Details'
    ];

    return (
        <div>
            <ToastContainer />
            <Button color="secondary" onClick={() => setActiveStep(0)}>Register</Button>
            <Dialog 
                open={activeStep !== null} 
                onClose={() => setActiveStep(null)} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    style: { 
                        borderRadius: '50px !important', // Możesz zwiększyć wartość, aby uzyskać bardziej zaokrąglone rogi.
                        padding: '20px'  // Dodatkowe opcjonalne padding wewnętrzne, aby treści nie były zbyt blisko brzegów.
                    }
                }}
            >
                <DialogTitle>
                    <Box textAlign="center" sx={{ marginTop: '20px'}}>
                        <AccountCircle style={{ fontSize: 120, color: '#fca311' }} />
                        <Typography sx={{ color: '#fca311', fontSize: '6vh' }}>Register</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent style={{ padding: '50px' }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{
                    '.MuiStepIcon-root': { color: '#fca311' }, // Active and completed color
                    '.MuiStepIcon-root.Mui-active': { color: '#fca311' }, // Currently active step color
                    '.MuiStepIcon-root.Mui-completed': { color: '#fca311' }, // Completed step color
                    '.MuiStepIcon-root': { color: '#fcc97c' }, // Default color for steps that are not yet active
                    '.MuiStepLabel-label': { fontSize: '1rem' }, // Font size for labels

                    marginBottom: '3rem',
                    marginTop: '-20px'
                    }}>
                    {steps.map((label) => (
                        <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                    {activeStep === 0 && (
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={userData.email}
                            onChange={handleChange('email')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email style={{ color: '#fca311' }} />
                                    </InputAdornment>
                                ),
                                sx: { fontSize: '2rem' }
                            }}
                            InputLabelProps={{
                                style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="phone"
                            label="Phone"
                            type="tel"
                            fullWidth
                            variant="standard"
                            value={userData.phone}
                            onChange={handleChange('phone')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone style={{ color: '#fca311' }} />
                                    </InputAdornment>
                                ),
                                sx: { fontSize: '2rem' }
                            }}
                            InputLabelProps={{
                                style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                shrink: true
                            }}
                        />
                        </Grid>
                        </Grid>
                    )}
                    {activeStep === 1 && (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="firstName"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={userData.firstName}
                                    onChange={handleChange('firstName')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '2rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="lastName"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={userData.lastName}
                                    onChange={handleChange('lastName')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '2rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="dob"
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    variant="standard"
                                    value={userData.dob}
                                    onChange={handleChange('dob')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Cake style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '2rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                    {activeStep === 2 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="username"
                                    label="Username"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={userData.username}
                                    onChange={handleChange('username')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '2rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    variant="standard"
                                    value={userData.password}
                                    onChange={handleChange('password')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '2rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    variant="standard"
                                    value={userData.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '2rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button sx={{ fontSize: '1.25rem', minWidth: '150px' }} onClick={() => setActiveStep(null)}>Cancel</Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        {activeStep !== 0 && <Button sx={{ fontSize: '1.25rem', minWidth: '150px' }} onClick={handleBack}>Back</Button>}
                        {activeStep !== 2 ? <Button variant="contained" sx={{ fontSize: '1.25rem', minWidth: '150px' }} color="secondary" onClick={handleNext}>Next</Button> : <Button variant="contained" sx={{ fontSize: '1.25rem', minWidth: '150px' }} color="secondary" onClick={handleSubmit}>Submit</Button>}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RegisterForm;
