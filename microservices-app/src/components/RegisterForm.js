import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, InputAdornment, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import { AccountCircle, Email, Phone, Cake, Lock, Person } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastStyles.css';

const RegisterForm = () => {
    const [activeStep, setActiveStep] = useState(null);
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
    const [errors, setErrors] = useState({});

    const handleNext = () => {
        if (activeStep < 2) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isStepComplete = () => {
        switch (activeStep) {
            case 0:
                return userData.email !== '' && userData.phone !== '';
            case 1:
                return userData.firstName !== '' && userData.lastName !== '' && userData.dob !== '';
            case 2:
                return userData.username !== '' && userData.password !== '' && userData.confirmPassword !== '';
            default:
                return false;
        }
    };

    const validateField = (name, value) => {
        switch(name) {
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    return 'Invalid email format';
                }
                break;
            case 'phone':
                if (!/^\d{9,}$/.test(value)) {
                    return 'Phone number must be at least 9 digits';
                }
                break;
            case 'firstName':
            case 'lastName':
            case 'username':
                if (!value.trim()) {
                    return 'This field is required';
                }
                break;
            case 'password':
                if (value.length < 8) {
                    return 'Password must be at least 8 characters';
                }
                break;
            case 'confirmPassword':
                if (value !== userData.password) {
                    return 'Passwords do not match';
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const checkUniqueness = async (field, value) => {
        const response = await fetch(`http://localhost:5002/check-unique?field=${field}&value=${value}`);
        const data = await response.json();
        return data.isUnique;
    };
    
    const handleBlur = (prop) => async (event) => {
        const { value } = event.target;
        const isUnique = await checkUniqueness(prop, value);
        if (!isUnique) {
            setErrors({ ...errors, [prop]: `${prop} is already taken` });
        } else {
            const error = validateField(prop, value);
            setErrors({ ...errors, [prop]: error || '' });
        }
    };

    const handleChange = (prop) => (event) => {
        let value = event.target.value;
        if (prop === 'phone') {
            value = value.replace(/\D/g, ''); 
        }
        setUserData({ ...userData, [prop]: value });
        if (errors[prop]) {
            const error = validateField(prop, value);
            setErrors({...errors, [prop]: error});
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};
        Object.keys(userData).forEach(key => {
            const error = validateField(key, userData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });
        setErrors(newErrors);
    
        if (!isValid) {
            toast.error("Validation failed. Please check your inputs.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return; // Stop submission if validation fails
        }
    
        const { confirmPassword, ...dataToSend } = userData;
    
        fetch('http://localhost:5002/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    toast.success(`Registration successful!`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        icon: "🚀"
                    });
                    setActiveStep(null); // Close dialog on successful registration
                });
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || "Unknown error occurred during registration");
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            toast.error(`Failed to register: ${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    };

    const steps = ['Phone Number', 'Personal Details', 'Account Details'];

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
                        borderRadius: '50px !important',
                        padding: '10px'
                    }
                }}
            >
                <DialogTitle>
                    <Box textAlign="center" sx={{ marginTop: '0px'}}>
                        <AccountCircle style={{ fontSize: 120, color: '#fca311', marginBottom: '-20px' }} />
                        <Typography sx={{ color: '#fca311', fontSize: '6vh' }}>Register</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent style={{ padding: '50px' }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{
                        '.MuiStepIcon-root.Mui-active': { color: '#fca311' },
                        '.MuiStepIcon-root.Mui-completed': { color: '#fca311' },
                        '.MuiStepIcon-root': { color: '#fcc97c' },
                        '.MuiStepLabel-label': { fontSize: '1rem' },
                        marginBottom: '20px',
                        marginTop: '-40px'
                    }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Grid container spacing={2}>
                        {activeStep === 0 && <>
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
                                    onBlur={handleBlur('email')}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
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
                                    onBlur={handleBlur('phone')}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' },
                                        inputMode: 'numeric' // Wskazuje, że klawiatura numeryczna powinna być używana na urządzeniach mobilnych
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                        </>}
                        {activeStep === 1 && <>
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
                                    onBlur={handleBlur('firstName')}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
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
                                    onBlur={handleBlur('lastName')}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
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
                                    onBlur={handleBlur('dob')}
                                    error={!!errors.dob}
                                    helperText={errors.dob}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Cake style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                        </>}
                        {activeStep === 2 && <>
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
                                    onBlur={handleBlur('username')}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
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
                                    onBlur={handleBlur('password')}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
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
                                    onBlur={handleBlur('confirmPassword')}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock style={{ color: '#fca311' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { fontSize: '1.75rem' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fca311', fontSize: '1.75rem', top: '-13px' },
                                        shrink: true
                                    }}
                                />
                            </Grid>
                        </>}
                    </Grid>
                </DialogContent>
                <DialogActions style={{ padding: '0px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button sx={{ fontSize: '1.25rem', minWidth: '150px' }} onClick={() => setActiveStep(null)}>Cancel</Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        {activeStep !== 0 && <Button sx={{ fontSize: '1.25rem', minWidth: '150px' }} onClick={handleBack}>Back</Button>}
                        {activeStep !== 2 ? <Button variant="contained" sx={{ fontSize: '1.25rem', minWidth: '150px' }} color="secondary" onClick={handleNext} disabled={!isStepComplete()}>Next</Button> : <Button variant="contained" sx={{ fontSize: '1.25rem', minWidth: '150px' }} color="secondary" onClick={handleSubmit}>Submit</Button>}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RegisterForm;
