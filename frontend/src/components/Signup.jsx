import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Person, HowToReg } from '@mui/icons-material';
import logo from '../assets/logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { firstName, lastName, email, password } = formData;
            await authService.signup({ firstName, lastName, email, password });
            navigate('/login');
        } catch (err) {
            // DEBUG: Log error details to console
            console.log('=== ERROR DEBUG INFO ===');
            console.log('Full Error Object:', err);
            console.log('Error Status:', err.response?.status);
            console.log('Error Data:', err.response?.data);
            console.log('Error Message:', err.response?.data?.message);
            console.log('========================');

            // Check for duplicate email error (includes 403)
            if (err.response?.status === 403 ||
                err.response?.status === 409 ||
                err.response?.status === 400 ||
                err.response?.data?.message?.toLowerCase().includes('already exists') ||
                err.response?.data?.message?.toLowerCase().includes('duplicate')) {
                setError('⚠️ An account with this email already exists. Please login or use a different email.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #003566 0%, #001D3D 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative circles */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    top: -100,
                    right: -100,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    bottom: -50,
                    left: -50,
                }}
            />

            <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, py: 4 }}>
                <Paper
                    elevation={24}
                    sx={{
                        p: 5,
                        width: '100%',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Logo and Title */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img src={logo} alt="Logo" style={{ width: 80, height: 80, marginBottom: 16 }} />
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1d2129', mb: 1 }}>
                            Mini Google Drive
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#6e7c87', fontWeight: 400 }}>
                            Create your account to get started
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setError('')}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                margin="normal"
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#003566' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                margin="normal"
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#003566' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: '#003566' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: '#003566' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: '#003566' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={loading ? null : <HowToReg />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #003566 0%, #001D3D 100%)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #001D3D 0%, #001D3D 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body1" sx={{ color: '#6e7c87' }}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{
                                        textDecoration: 'none',
                                        color: '#003566',
                                        fontWeight: 600
                                    }}
                                >
                                    Login
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;