"use client"

import {
    Button,
    Caption,
    Card,
    Checkbox,
    Flex,
    Header,
    Heading,
    IconButton,
    Switch,
    Text,
    TextField,
} from "@hdfclife-insurance/one-x-ui";
import { Eye, EyeSlash, WhatsappLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAppDispatch } from "../../../store/hooks";
// import { loginStart, loginSuccess, loginFailure } from "../../../store/slices/userSlice";
import Whatsapp from '../../assets/whatsapp-logo.svg'
import Logo from '../../assets/download.svg'
import Image from "next/image";

const Login = () => {
    const [toggle, setToggle] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // Signup form state
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        phoneNumber: ""
    });
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupError, setSignupError] = useState("");

    const router = useRouter();
    // const dispatch = useAppDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error state
        setError("");
        // dispatch(loginStart());

        // Basic validation
        if (!username.trim()) {
            const errorMsg = "Please enter your username/email";
            setError(errorMsg);
            // dispatch(loginFailure(errorMsg));
            return;
        }

        if (!password.trim()) {
            const errorMsg = "Please enter your password";
            setError(errorMsg);
            // dispatch(loginFailure(errorMsg));
            return;
        }

        setLoading(true);

        try {
            console.log('📤 Attempting login with:', {
                username: username,
                passwordLength: password.length
            });

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim(),
                }),
                credentials: 'include', // Include cookies in request
            });

            const data = await response.json();

            console.log('📝 Login response:', {
                status: response.status,
                success: data.success,
                message: data.message,
                userData: data.user
            });

            if (response.ok && data.success) {
                console.log('✅ Login successful, storing user data and redirecting...');

                // Extract user data from response
                const userData = data.user || {};
                const userPayload = {
                    name: userData.name || username, // Fallback to username if name not provided
                    role: userData.role || "User", // Default role if not provided
                    time: userData.time || new Date().toLocaleString() // Current time if not provided
                };

                console.log('👤 Storing user data in Redux:', userPayload);

                // Dispatch login success with user data
                // dispatch(loginSuccess(userPayload));

                // Successful login - redirect to dashboard
                router.push('/dashboard');
            } else {
                // Handle login error
                const errorMsg = data.message || 'Login failed. Please check your credentials.';
                setError(errorMsg);
                // dispatch(loginFailure(errorMsg));
                console.error('❌ Login failed:', data.message);
            }

        } catch (error: any) {
            console.error('❌ Login error:', error);
            const errorMsg = 'Network error. Please check your connection and try again.';
            setError(errorMsg);
            // dispatch(loginFailure(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error state
        setSignupError("");

        // Basic validation
        if (!signupData.name.trim()) {
            setSignupError("Please enter your name");
            return;
        }

        if (!signupData.email.trim()) {
            setSignupError("Please enter your email");
            return;
        }

        if (!signupData.username.trim()) {
            setSignupError("Please enter a username");
            return;
        }

        if (!signupData.password.trim()) {
            setSignupError("Please enter a password");
            return;
        }

        if (!signupData.phoneNumber.trim()) {
            setSignupError("Please enter your phone number");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupData.email)) {
            setSignupError("Please enter a valid email address");
            return;
        }

        // Phone number validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(signupData.phoneNumber.replace(/\D/g, ''))) {
            setSignupError("Please enter a valid 10-digit phone number");
            return;
        }

        setSignupLoading(true);

        try {
            console.log('📤 Attempting signup with:', {
                name: signupData.name,
                email: signupData.email,
                username: signupData.username,
                phoneNumber: signupData.phoneNumber
            });

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signupData.name.trim(),
                    email: signupData.email.trim(),
                    username: signupData.username.trim(),
                    password: signupData.password.trim(),
                    phoneNumber: signupData.phoneNumber.trim()
                }),
                credentials: 'include',
            });

            const data = await response.json();

            console.log('📝 Signup response:', {
                status: response.status,
                success: data.success,
                message: data.message
            });

            if (response.ok && data.success) {
                console.log('✅ Signup successful');
                alert('✅ Account created successfully! Please login with your credentials.');

                // Reset signup form and switch to login
                setSignupData({
                    name: "",
                    email: "",
                    username: "",
                    password: "",
                    phoneNumber: ""
                });
                setShowSignup(false);

                // Pre-fill username in login form
                setUsername(signupData.username);
            } else {
                setSignupError(data.message || 'Signup failed. Please try again.');
                console.error('❌ Signup failed:', data.message);
            }

        } catch (error: any) {
            console.error('❌ Signup error:', error);
            setSignupError('Network error. Please check your connection and try again.');
        } finally {
            setSignupLoading(false);
        }
    };

    const updateSignupData = (field: string, value: string) => {
        setSignupData(prev => ({
            ...prev,
            [field]: value
        }));
        if (signupError) setSignupError(""); // Clear error when user types
    };

    return (
        <div className="flex flex-col justify-center min-h-screen lg:min-h-dvh px-4 lg:px-10 py-8">
            {/* Main content  */}
            <main className="flex justify-center items-center flex-1">
                <div className="w-full space-y-4 max-w-md">
                    {/* Login Card  */}
                    <Card
                        className="border-none"
                        classNames={{
                            content: "!gap-4 lg:!gap-5 p-4 lg:p-6",
                        }}
                    >
                        <Image src={Logo} className="w-12 h-12 lg:w-15 lg:h-15 mx-auto" alt="logo" />
                        <div className="space-y-2 text-start">
                            <Heading as="h3" className="text-lg lg:text-xl">{showSignup ? "Create Account" : "Welcome back,"}</Heading>
                            <Caption className="text-gray-700 text-sm">
                                {showSignup ? "Sign up to get started" : "Login to get Started"}
                            </Caption>
                        </div>

                        {!showSignup ? (
                            // Login Form
                            <form className="space-y-3 lg:space-y-4" onSubmit={handleLogin}>
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        ❌ {error}
                                    </div>
                                )}

                                <TextField
                                    variant="underline"
                                    label="Username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (error) setError(""); // Clear error when user types
                                    }}
                                    disabled={loading}
                                    required
                                />

                                <TextField
                                    placeholder="Enter your password"
                                    variant="underline"
                                    label="Password"
                                    type={!toggle ? "password" : "text"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError(""); // Clear error when user types
                                    }}
                                    disabled={loading}
                                    required
                                    rightSection={
                                        <IconButton
                                            variant="link"
                                            size="sm"
                                            onClick={() => setToggle(!toggle)}
                                            disabled={loading}
                                        >
                                            {toggle ? <EyeSlash /> : <Eye />}
                                        </IconButton>
                                    }
                                />

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                                    <Checkbox
                                        label="Remember Me"
                                        size="sm"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe((e.target as HTMLInputElement).checked)}
                                        disabled={loading}
                                    />
                                    <Button size="xs" variant="link" disabled={loading}>
                                        Forget Password?
                                    </Button>
                                </div>

                                <Button
                                    size="lg"
                                    fullWidth
                                    type="submit"
                                    disabled={loading || !username.trim() || !password.trim()}
                                    className="mt-4 lg:mt-6"
                                >
                                    {loading ? "Signing in..." : "Login"}
                                </Button>

                                <div className="text-center">
                                    <Text size="sm" className="text-gray-600">
                                        Don't have an account?{" "}
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => setShowSignup(true)}
                                            disabled={loading}
                                            className="p-0 h-auto"
                                        >
                                            Sign up here
                                        </Button>
                                    </Text>
                                </div>
                            </form>
                        ) : (
                            // Signup Form
                            <form className="space-y-3 lg:space-y-4" onSubmit={handleSignup}>
                                {signupError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        ❌ {signupError}
                                    </div>
                                )}

                                <TextField
                                    variant="underline"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={signupData.name}
                                    onChange={(e) => updateSignupData("name", e.target.value)}
                                    disabled={signupLoading}
                                    required
                                />

                                <TextField
                                    variant="underline"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={signupData.email}
                                    onChange={(e) => updateSignupData("email", e.target.value)}
                                    disabled={signupLoading}
                                    required
                                />

                                <TextField
                                    variant="underline"
                                    label="Username"
                                    placeholder="Choose a username"
                                    value={signupData.username}
                                    onChange={(e) => updateSignupData("username", e.target.value)}
                                    disabled={signupLoading}
                                    required
                                />

                                <TextField
                                    variant="underline"
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    type="text"
                                    value={signupData.phoneNumber}
                                    onChange={(e) => updateSignupData("phoneNumber", e.target.value)}
                                    disabled={signupLoading}
                                    required
                                />

                                <TextField
                                    placeholder="Create a password"
                                    variant="underline"
                                    label="Password"
                                    type={!toggle ? "password" : "text"}
                                    value={signupData.password}
                                    onChange={(e) => updateSignupData("password", e.target.value)}
                                    disabled={signupLoading}
                                    required
                                    rightSection={
                                        <IconButton
                                            variant="link"
                                            size="sm"
                                            onClick={() => setToggle(!toggle)}
                                            disabled={signupLoading}
                                        >
                                            {toggle ? <EyeSlash /> : <Eye />}
                                        </IconButton>
                                    }
                                />

                                <Button
                                    size="lg"
                                    fullWidth
                                    type="submit"
                                    disabled={signupLoading || !signupData.name.trim() || !signupData.email.trim() ||
                                        !signupData.username.trim() || !signupData.password.trim() || !signupData.phoneNumber.trim()}
                                    className="mt-4 lg:mt-6"
                                >
                                    {signupLoading ? "Creating Account..." : "Sign Up"}
                                </Button>

                                <div className="text-center">
                                    <Text size="sm" className="text-gray-600">
                                        Already have an account?{" "}
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => setShowSignup(false)}
                                            disabled={signupLoading}
                                            className="p-0 h-auto"
                                        >
                                            Login here
                                        </Button>
                                    </Text>
                                </div>
                            </form>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}