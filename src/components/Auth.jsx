import React, { useState } from "react";
import { Form, Input, Button, Typography, Result, Spin, Modal } from "antd";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

const { Title } = Typography;

const AuthForm = ({ setUser }) => {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
    isSignUp: false,
    confirmationSent: false,
    loading: false,
    isForgotPassword: false,
    forgotPasswordEmail: "",
    resetEmailSent: false,
  });

  const {
    email,
    password,
    isSignUp,
    confirmationSent,
    loading,
    isForgotPassword,
    forgotPasswordEmail,
    resetEmailSent,
  } = authState;

  const handleStateChange = (key, value) => {
    setAuthState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSignUp = async () => {
    handleStateChange("loading", true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    handleStateChange("loading", false);
    if (error) {
      console.error("Sign-up error:", error.message);
    } else {
      handleStateChange("confirmationSent", true);
    }
  };

  const handleSignIn = async () => {
    handleStateChange("loading", true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    handleStateChange("loading", false);
    if (error) {
      console.error("Sign-in error:", error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleForgotPassword = async () => {
    handleStateChange("loading", true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      forgotPasswordEmail
    );
    handleStateChange("loading", false);
    if (error) {
      console.error("Reset password error:", error.message);
    } else {
      handleStateChange("resetEmailSent", true);
      handleStateChange("isForgotPassword", false); // Close the modal
    }
  };

  return confirmationSent ? (
    <Result
      status="success"
      title="Sign-up Successful"
      subTitle="Please check your email to confirm your account."
      extra={[
        <Button
          type="primary"
          key="signin"
          onClick={() => {
            handleStateChange("isSignUp", false);
            handleStateChange("confirmationSent", false);
          }}
        >
          Sign In
        </Button>,
      ]}
    />
  ) : resetEmailSent ? (
    <Result
      status="success"
      title="Reset Email Sent"
      subTitle="Please check your email to reset your password."
      extra={[
        <Button
          type="primary"
          key="signin"
          onClick={() => {
            handleStateChange("isSignUp", false);
            handleStateChange("resetEmailSent", false);
          }}
        >
          Sign In
        </Button>,
      ]}
    />
  ) : (
    <div>
      {loading && (
        <div className="overlay">
          <Spin size="large" />
        </div>
      )}
      <Title>{isSignUp ? "Sign Up" : "Sign In"}</Title>
      <Form layout="vertical" onFinish={isSignUp ? handleSignUp : handleSignIn}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "The input is not a valid email!" },
          ]}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => handleStateChange("email", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            value={password}
            onChange={(e) => handleStateChange("password", e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </Form.Item>

        <Button
          type="link"
          onClick={() => handleStateChange("isSignUp", !isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>

        {!isSignUp && (
          <Button
            type="link"
            onClick={() => handleStateChange("isForgotPassword", true)}
          >
            Forgot Password?
          </Button>
        )}
      </Form>

      <Modal
        title="Reset Password"
        open={isForgotPassword}
        onOk={handleForgotPassword}
        onCancel={() => handleStateChange("isForgotPassword", false)}
      >
        <Form layout="vertical">
          <Form.Item
            label="Enter your email to reset password"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "The input is not a valid email!" },
            ]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) =>
                handleStateChange("forgotPasswordEmail", e.target.value)
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthForm;
