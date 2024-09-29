// src/components/AuthForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { supabase } from '../supabaseClient';

const { Title } = Typography;

const AuthForm = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async () => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Sign-up error:', error.message);
    } else {
      alert('Sign-up successful! Please check your email to confirm your account.');
    }
  };

  const handleSignIn = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign-in error:', error.message);
    } else {
      setUser(data.user); // Set the user in parent component
    }
  };

  return (
    <div>
      <Title>{isSignUp ? 'Sign Up' : 'Sign In'}</Title>
      <Form
        layout="vertical"
        onFinish={isSignUp ? handleSignUp : handleSignIn}
      >
        <Form.Item label="Email" required>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Password" required>
          <Input.Password
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form.Item>

        <Button type="link" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </Form>
    </div>
  );
};

export default AuthForm;
