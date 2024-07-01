"use client";
import {
  Box,
  FormControl,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {
  GET_USER_PROFILE_BY_ID,
  UPDATE_USER_PROFILE,
} from "../utils/APIRoutes";
import useUserForm from "../hooks/useUserForm";

const UserProfile = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    toast.dismiss();
    setIsLoading(true);
    try {
      const response = await axios.post(UPDATE_USER_PROFILE, values);
      if (response.data) {
        const updatedUserData = response.data.data;
        toast.success("User profile updated successfully");

        // Update local storage and form with the updated user data
        updateLocalStorageAndForm(updatedUserData);

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setIsLoading(false);
      toast.error(
        error?.response?.data?.message || "Failed to update user profile"
      );
    }
  };
  const {
    reset: restFormValues,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const { updateLocalStorageAndForm, formReloadKey } =
    useUserForm(restFormValues);

  return (
    <>
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
      <div className="p-8">
        <div className="bg-white shadow-md rounded p-6">
          {/*  <div className="flex items-center mb-4">
          <img
            src="path_to_image"
            alt="Neil Sims"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">Neil Sims</h2>
            <p className="text-gray-700">Senior Software Engineer</p>
            <p className="text-gray-700">New York, USA</p>
          </div>
        </div> */}

          <form key={formReloadKey} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      type="date"
                      label="Date Of Birth"
                      InputLabelProps={{ shrink: true }}
                      sx={{ marginBottom: 2 }}
                      {...field}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select label="Gender" {...field} sx={{ marginBottom: 2 }}>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      type="email"
                      label="Email"
                      sx={{ marginBottom: 2 }}
                      placeholder="name@company.com"
                      {...field}
                      disabled
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Phone"
                      sx={{ marginBottom: 2 }}
                      placeholder="12-345 678 90"
                      {...field}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="mt-4">
              <FormControl fullWidth>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Address"
                      sx={{ marginBottom: 2 }}
                      placeholder="Enter your home address"
                      {...field}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormControl fullWidth>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="City"
                      sx={{ marginBottom: 2 }}
                      {...field}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="State"
                      sx={{ marginBottom: 2 }}
                      {...field}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="zip"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="ZIP"
                      sx={{ marginBottom: 2 }}
                      {...field}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="mt-4">
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
