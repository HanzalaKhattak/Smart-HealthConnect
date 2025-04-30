import { useState } from "react";
import InputField from "../Pages/Register/InputComponent/InputField";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // regex for password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const Submit =(e) => {
      e.preventDefault();
      if (email.trim() === "" || password.trim() === "") {
        alert("Please fill all the fields");
      }else if(!emailRegex.test(email)){
        setEmailError("Please enter a valid email address");
      }else if(!passwordRegex.test(password)){
        setPasswordError("Password must be at least 8 characters long and contain at least one letter and one number");
      }else{
        console.log("Email : ",email);
        console.log("Password :", password );
      }
    }
      return (  
      <>
      <div className='flex flex-col gap-10 justify-center items-center h-screen bg-gray-200'>
        <form className='flex flex-col border p-10 items-center w-100'>
          <h1 className='font-bold text-4xl pb-4'>Sign Up</h1>
          {/* Password */}
          <InputField label = {"Email "} setValue={setEmail} errorMessage={ emailError} type={"email"}/>
            {/* Passeord  */}
          <InputField label = {"Password "} setValue={setPassword} errorMessage={ passwordError} type={"password"} />

          <button onClick={Submit} className='mt-5 p-1 bg-yellow-200 border rounded-lg '>Submit</button>
      </form>
      </div>
      </>
  )
}

export default Login