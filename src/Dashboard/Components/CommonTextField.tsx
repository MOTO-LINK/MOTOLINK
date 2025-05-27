import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

const commonTextFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#BEB58F50",
      borderRadius: 4
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
    fontFamily: "ilight"
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  fontFamily: "ithin"
};

interface CommonTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
}

export const CommonTextField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  ...props
}: CommonTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          focused
          sx={commonTextFieldStyles}
        />
      )}
    />
  );
}; 