import React from 'react'
import { Button } from '@mui/material';

interface Props{
    value?: string;
    className?: string;
}

const Buttons = ({value,className}:Props) => {
  return (
    <>
     <Button
        type="submit"
        variant="contained"
        sx={{
        backgroundColor: "#D7B634", 
        color: "black", 
        fontSize: "19px", 
        padding: "12px 24px", 
        borderRadius: "8px", 
        textTransform: "none",
        my:1,
        "&:hover": {
            backgroundColor: "#D7B6344", 
        },
        }}
        className={` ${className}`}
        >
        {value}
    </Button>
    </>
  )
}

export default Buttons