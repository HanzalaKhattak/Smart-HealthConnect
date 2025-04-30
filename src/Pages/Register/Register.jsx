import React from 'react'
import { useState } from 'react';
import InputField from './InputComponent/InputField';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirnPassword, setConfirmPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const LoginPage = useNavigate();
    const handleClick = () => {
      LoginPage('/login');
    }
    
    // regex for username validation
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    // regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // regex for password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const Submit =(e) => {
      e.preventDefault();
      if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
        alert("Please fill all the fields");
      }else if(!usernameRegex.test(username) ){
        setUsernameError("Username must be at least 3 characters long and can only contain letters and numbers");
      }else if(!emailRegex.test(email)){
        setEmailError("Please enter a valid email address");
      }else if(!passwordRegex.test(password)){
        setPasswordError("Password must be at least 8 characters long and contain at least one letter and one number");
      }else{
        console.log("Username : ",username);
        console.log("Email : ",email);
        console.log("Password :", password );
        console.log("Confirm Password :", confirnPassword);
      }
    }
      return (  
      <>
      <div className='flex flex-col gap-10 justify-center items-center h-screen bg-gray-200'>
        <form className='flex flex-col border p-10 items-center w-100'>
        <h1 className='font-bold text-4xl pb-4'>Sign Up</h1>
          
            <InputField label = {"Username "} setValue={setUsername} errorMessage={ usernameError} type={"text"} />
          {/* Password */}
          <InputField label = {"Email "} setValue={setEmail} errorMessage={ emailError} type={"email"}/>
  
          
          
            {/* Passeord  */}
            <InputField label = {"Password "} setValue={setPassword} errorMessage={ passwordError} type={"password"} />
  
        {/* Confirm Password */}
         <InputField label = {"Confirm Password "} setValue={setConfirmPassword} errorMessage={ passwordError} type={"password"}/>
  
          <button onClick={Submit} className='mt-5 p-1 bg-yellow-200 border rounded-lg '>Submit</button>

          <p>Already have an account?</p>
          <button onClick={handleClick} className='text-blue-600 underline'>Login</button>
      </form>
      </div>
      </>
  )
}

export default Register