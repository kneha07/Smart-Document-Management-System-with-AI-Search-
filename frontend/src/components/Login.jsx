import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import logo from '../assets/logo.png';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            const userData = {
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName
            };
            login(response.data.token, userData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials.');
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
                    left: -100,
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
                    right: -50,
                }}
            />

            <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
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
                            Welcome back! Please login to continue
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
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                            startIcon={loading ? null : <LoginIcon />}
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
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body1" sx={{ color: '#6e7c87' }}>
                                Don't have an account?{' '}
                                <Link 
                                    to="/signup" 
                                    style={{ 
                                        textDecoration: 'none', 
                                        color: '#003566',
                                        fontWeight: 600
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;