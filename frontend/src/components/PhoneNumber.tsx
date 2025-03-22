import React, { useState } from "react";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select"; 
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import countries from "../lib/country";

interface PhoneNumberInputProps extends Omit<OutlinedTextFieldProps, 'variant'> {
  error?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  error,
  helperText,
  variant = 'outlined',
  onChange,
  ...props
}) => {
  const [countryCode, setCountryCode] = useState("+20");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    const newCountryCode = event.target.value as string;
    setCountryCode(newCountryCode);
    // Trigger onChange with the combined value
    onChange({
      target: {
        value: newCountryCode + phoneNumber,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
    // Trigger onChange with the combined value
    onChange({
      target: {
        value: countryCode + newPhoneNumber,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <TextField
      {...props}
      error={error}
      helperText={helperText}
      variant={variant}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "#BEB58F50",
            borderRadius: 4,
          },
          "& .MuiInputBase-input": {
            color: "white",
            fontFamily: "ilight",
          },
          "& .MuiInputLabel-root": {
            color: "white !important",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "white !important",
          },
          "& fieldset": {
            borderColor: "#BEB58F50",
            borderRadius: 4,
          },
          "&:hover fieldset": {
            borderColor: "#BEB58F50",
          },
        },
      }}
      label="Phone Number"
      placeholder="Enter your phone number"
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Select
              value={countryCode}
              onChange={handleCountryCodeChange} // Use the correct event type
              variant="standard"
              sx={{
                "& .MuiSelect-select": {
                  paddingRight: "0px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
                "& .MuiSvgIcon-root": {
                  display: "none",
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.dial_code}>
                  <span>{country.name}</span>
                  <span>{country.dial_code}</span>
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PhoneNumberInput;