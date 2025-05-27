import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface PhoneNumberFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
}

export const PhoneNumberField = <T extends FieldValues>({name,control}: PhoneNumberFieldProps<T>) => {
  return (
    <Controller name={name} control={control} render={({ field, fieldState: { error } }) => (
        <PhoneNumberInput {...field} error={!!error} helperText={error?.message} />
      )}
    />
  );
}; 