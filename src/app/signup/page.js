"use client";

import Image from "next/image";
import SignUpImage from "/public/sign_up.svg";
import EmailIconSvg from "/public/mail-stroke-rounded.svg";
import EmailVerificationSvg from "/public/email-verfiy.svg";
import { Box, FormControl, TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { REGISTER, SENDOTP, VERIFY_OTP_ENDPOINT } from "../utils/APIRoutes";

const page = () => {
  const router = useRouter();
  const otpRefs = useRef([]);
  const firstOtpRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [otpResendCountdown, setOtpResendCountdown] = useState(59);
  const [isResendBtnVisible, setIsResendBtnVisible] = useState(false);

  // Focus on the first OTP input field when isOtpVisible is true
  useEffect(() => {
    if (isOtpVisible && firstOtpRef.current) {
      firstOtpRef.current.focus();
    }
  }, [isOtpVisible]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (isOtpVisible) {
      setOtpResendCountdown(59);
      setIsResendBtnVisible(false);
      timer = setInterval(() => {
        setOtpResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendBtnVisible(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpVisible]);

  // Framer Motion animation variants for the image
  const imageVariants = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const textVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
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

  // Handle form submission
  const handleSignUp = async (values) => {
    toast.dismiss();
    setIsLoading(true);
    try {
      const response = await axios.post(REGISTER, values);
      if (response.data) {
        toast.success("Register Successfully");
        setIsOtpVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (enteredOtp) => {
    toast.dismiss();
    setIsLoading(true);
    try {
      const response = await axios.post(VERIFY_OTP_ENDPOINT, {
        email: email,
        otpValues: enteredOtp,
      });
      if (response.data) {
        toast.success("OTP Verified Successfully");
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        router.push(`/`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
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

  // Handle OTP input change
  const handleOtpInputChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);

    // Check if all OTP fields are filled
    if (index === 5 && newOtp.every((item) => item !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }

    // Focus on the next input field if the current field is not the last one
    if (index < otpRefs.current.length - 1 && element.value) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle OTP input backspace keydown
  const handleOtpInputKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);

      // Focus on the previous input field if the current field is not the first one
      if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
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
          {isOtpVisible ? (
            <>
              <motion.div
                className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8 bg-gray-100"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={imageVariants}
                key="signupImage"
              >
                <Image
                  src={EmailVerificationSvg}
                  width={200}
                  height={200}
                  alt="Email verification Image"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="p-8 w-full md:w-1/2 flex flex-col justify-center"
                initial="initial"
                animate="animate"
                exit="initial"
                variants={textVariants}
                key="signup"
              >
                <h2 className="text-2xl font-semibold mb-5">
                  Please verify your account !
                </h2>
                <p class="flex items-center gap-3 bg-green-100 p-4  mb-6 rounded-lg text-gray-800">
                  <div class="flex justify-center items-center w-14 h-14 rounded-full bg-dark-green">
                    <Image
                      src={EmailIconSvg}
                      width={30}
                      height={30}
                      alt="Email Image"
                      className="object-cover "
                    />
                  </div>
                  {`Enter the One Time Password (OTP) which has been sent to (${email})`}
                </p>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  {otpValues.map((data, index) => (
                    <TextField
                      key={index}
                      type="text"
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={data}
                      onChange={(e) => handleOtpInputChange(e.target, index)}
                      onKeyDown={(e) => handleOtpInputKeyDown(e, index)}
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
                <div>
                  {isResendBtnVisible ? (
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
                      Didn't receive OTP? Resend in {otpResendCountdown} sec
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8 bg-gray-100"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={imageVariants}
                key="signupImage"
              >
                <Image
                  src={SignUpImage}
                  width={200}
                  height={200}
                  alt="Sign Up Image"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="p-8 w-full md:w-1/2 flex flex-col justify-center"
                initial="initial"
                animate="animate"
                exit="initial"
                variants={textVariants}
                key="signup"
              >
                <h2 className="text-2xl font-semibold mb-5">Sign Up 👋</h2>
                <form autoComplete="off" onSubmit={handleSubmit(handleSignUp)}>
                  <FormControl fullWidth>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{
                        required: "First name is required",
                        validate: (value) => {
                          if (!/^[^0-9]+$/.test(value)) {
                            return "First name should contain alphabetic characters";
                          }
                          if (value.length < 3) {
                            return "First name should be at least 3 characters long";
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          autoFocus
                          label="First Name"
                          sx={{ marginBottom: 2 }}
                          {...field}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{
                        required: "Last name is required",
                        validate: (value) => {
                          if (!/^[^0-9]+$/.test(value)) {
                            return "Last name should contain alphabetic characters";
                          }
                          if (value.length < 3) {
                            return "Last name should be at least 3 characters long";
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          label="Last Name"
                          sx={{ marginBottom: 2 }}
                          {...field}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </FormControl>

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
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   if (isOtpVisible) {
                          //     setIsOtpVisible(false);
                          //     setOtpValues(new Array(6).fill(""));
                          //   }
                          // }}
                          // disabled={isOtpVisible}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      rules={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "Enter a valid phone number",
                        },
                        validate: (value) =>
                          value.length === 10 ||
                          "Phone number must be exactly 10 digits",
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          type="text"
                          label="Phone Number"
                          sx={{ marginBottom: 4 }}
                          {...field}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </FormControl>

                  <button
                    type="submit"
                    className="p-2 bg-green-500 text-white rounded w-full"
                  >
                    Sign Up
                  </button>
                </form>
                <div
                  className="mt-4 text-center text-sm text-gray-500 cursor-pointer"
                  onClick={() => router.replace("/login")}
                >
                  Already have an account →
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default page;
