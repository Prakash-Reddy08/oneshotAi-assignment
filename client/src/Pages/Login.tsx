import React, { useState } from "react";
import { styled } from "styled-components";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showOTP] = useState(true);
  const [otp, setOTP] = useState("");

  const handleLogin = async () => {
    //   try {
    //     // Send the email to the backend to request OTP
    //     // Replace 'your_api_endpoint' with the actual endpoint to request OTP
    //     const response = await fetch('your_api_endpoint', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ email }),
    //     });
    //     if (response.ok) {
    //       setShowOTP(true);
    //     } else {
    //       // Handle error case
    //       console.error('Failed to send OTP');
    //     }
    //   } catch (error) {
    //     console.error('Failed to send OTP:', error);
    //   }
  };

  const handleOTPSubmit = async () => {
    //   try {
    //     // Send the OTP to the backend for verification
    //     // Replace 'your_api_endpoint' with the actual endpoint to verify OTP
    //     const response = await fetch('your_api_endpoint', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ email, otp }),
    //     });
    //     if (response.ok) {
    //       // Successful login, handle the login success here
    //       console.log('Login successful');
    //     } else {
    //       // Handle error case
    //       console.error('Invalid OTP');
    //     }
    //   } catch (error) {
    //     console.error('Failed to verify OTP:', error);
    //   }
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={showOTP}
        />
        {showOTP ? (
          <>
            <Input
              type="number"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
            />
            <Button onClick={handleOTPSubmit}>Login</Button>
          </>
        ) : (
          <Button onClick={handleLogin}>Request OTP</Button>
        )}
      </LoginForm>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  width: 300px;
  font-size: 16px;
  &:disabled {
    cursor: not-allowed;
    background-color: grey;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

export default Login;
