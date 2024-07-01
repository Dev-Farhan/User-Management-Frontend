// src/hooks/useUserForm.js
import { useEffect, useState } from "react";

const useUserForm = (reset) => {
  const [formReloadKey, setFormReloadKey] = useState(Math.random());

  const updateFormValues = (data) => {
    reset({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    });
    setFormReloadKey(Math.random());
  };

  const updateFormValuesFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      updateFormValues(user);
    }
  };

  useEffect(() => {
    updateFormValuesFromLocalStorage();
  }, []);

  const updateLocalStorageAndForm = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    updateFormValues(userData);
  };

  return { updateLocalStorageAndForm, formReloadKey };
};

export default useUserForm;
