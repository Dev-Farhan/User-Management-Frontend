"use client";

import Image from "next/image";
import LoginImage from "/public/mobile_content_xvgr.svg";
import { Box, FormControl, TextField, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { SENDOTP, VERIFY_OTP_ENDPOINT } from "../utils/APIRoutes";

export default function Page() {
  const [showOtp, setShowOtp] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const [showResendOtpButton, setShowResendOtpButton] = useState(false);

  // References for OTP input fields
  const otpRefs = useRef([]);
  const firstOtpRef = useRef(null);
  const router = useRouter();

  // Focus on the first OTP input field when showOtpInput is true
  useEffect(() => {
    if (showOtp && firstOtpRef.current) {
      firstOtpRef.current.focus();
    }
  }, [showOtp]);

  // Redirect to the sign-up page when isSignUpVisible is true
  useEffect(() => {
    if (isSignUpVisible) {
      router.replace("/signup");
    }
  }, [isSignUpVisible]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (showOtp) {
      setCountdown(59);
      setShowResendOtpButton(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowResendOtpButton(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtp]);

  // Variants for image animation
  const imageVariants = {
    initial: { x: -200, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Variants for text animation
  const textVariants = {
    initial: { x: 200, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Watch the email field
  const email = watch("email");

  // Handle OTP input change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus on the next input field if the current field is not the last one
    if (index < otpRefs.current.length - 1 && element.value) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle OTP input backspace keydown
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Focus on the previous input field if the current field is not the first one
      if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  // Handle OTP generation
  const handleGenerateOtp = async (value) => {
    toast.dismiss();
    setIsLoading(true);
    try {
      const response = await axios.post(SENDOTP, { email: value.email });
      if (response.data) {
        toast.success("OTP send successfully");
        setShowOtp(true);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  // Handle login with OT
  const handleLoginWithOtp = async (value) => {
    toast.dismiss();
    const enteredOtp = otp.join("");
    const data = {
      email: value.email,
      otp: enteredOtp,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(VERIFY_OTP_ENDPOINT, data);
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      toast.success("Login sucessfully");
      router.push("/");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message || error);
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    toast.dismiss();
    setIsLoading(true);
    try {
      const response = await axios.post(SENDOTP, { email });
      if (response.data) {
        toast.success("OTP send successfully");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOtp(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div className="mx-2 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full md:w-2/4 lg:w-2/3 md:min-h-[500px]">
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
              position: "fixed",
              top: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 9999,
            }}
          >
            <HashLoader color="#2978e6" />
          </Box>
        )}

        <AnimatePresence>
          <motion.div
            className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8 bg-gray-100"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={imageVariants}
            key="loginImage"
          >
            <Image
              src={LoginImage}
              width={200}
              height={200}
              alt="Login Image"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            className="p-8 w-full md:w-1/2 flex flex-col justify-center relative"
            initial="initial"
            animate="animate"
            exit="initial"
            variants={textVariants}
            key="login"
          >
            {showOtp && (
              <button
                className="absolute top-4 right-4 p-2  "
                onClick={handleBackClick}
              >
                <Tooltip title="Back">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="grey"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
                    <path d="m12.707 8.707-1.414-1.414L6.586 12l4.707 4.707 1.414-1.414L10.414 13H16v-2h-5.586l2.293-2.293z" />
                  </svg>
                </Tooltip>
              </button>
            )}
            <h2 className="text-2xl font-semibold mb-5">
              {!showOtp ? "👋 Welcome back!" : "Please enter OTP"}
            </h2>
            <form autoComplete="off">
              <FormControl fullWidth>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="email"
                      id="email"
                      label="Email"
                      sx={{ marginBottom: 2 }}
                      {...field}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      onChange={(e) => {
                        field.onChange(e);
                        if (showOtp) {
                          setShowOtp(false);
                          setOtp(new Array(6).fill(""));
                        }
                      }}
                      disabled={showOtp}
                    />
                  )}
                />
              </FormControl>

              {showOtp && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  {otp.map((data, index) => (
                    <TextField
                      key={index}
                      type="text"
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      sx={{ width: "3rem", marginRight: index < 5 ? 1 : 0 }}
                      inputRef={(ref) => {
                        otpRefs.current[index] = ref;
                        if (index === 0) {
                          firstOtpRef.current = ref;
                        }
                      }}
                    />
                  ))}
                </Box>
              )}

              <button
                type="submit"
                className="p-2 bg-green-500 text-white rounded w-full"
                onClick={
                  email && !showOtp
                    ? handleSubmit(handleGenerateOtp)
                    : handleSubmit(handleLoginWithOtp)
                }
              >
                {showOtp ? "LOGIN" : "GENERATE OTP"}
              </button>
            </form>

            {showOtp ? (
              showResendOtpButton ? (
                <div className="mt-4 text-center text-sm text-gray-500 cursor-pointer">
                  Didn't receive OTP ?
                  <span
                    onClick={handleResendOtp}
                    className="cursor-pointer text-blue-900 font-medium"
                  >
                    Resend
                  </span>
                </div>
              ) : (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Didn't receive OTP? Resend in {countdown} sec
                </div>
              )
            ) : (
              <div
                className="mt-4 text-center text-sm text-gray-500 cursor-pointer"
                onClick={() => setIsSignUpVisible(true)}
              >
                Create your Account →
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
