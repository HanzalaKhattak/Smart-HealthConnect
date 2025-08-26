import { useState } from "react";
import InputField from "../Register/InputComponent/InputField";
import { useNavigate } from "react-router-dom";
import { API_User } from "../../Components/apis/apisUrl";
import { Login_User } from "../../Components/apis/endpoints";
import axios from "axios";


const Login = () => {

  const Nav = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [msg, setMsg] = useState("");

  // regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // regex for password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const Submit = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill all the fields");
    }
    else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long and contain at least one letter and one number");
    } else {
      // console.log("Email : ", email);
      // console.log("Password :", password);
      const login = {
        email:email,password:password
      }

      console.log("login",login);
      
      const login_Url = API_User + Login_User;
      console.log(login_Url)
      const res = await axios.post(login_Url,login);
      console.log("res",res)
      const data = res.data;  
      if(data){
        setMsg(data.msg)
        localStorage.setItem('token',data.User_Token)
        localStorage.setItem('username',data.LoginUser.username)
        localStorage.setItem('userInfo',data.LoginUser.email)
        Nav('/')
      }

      // const newUserData = {
      //   email: email, password: password,
      // }
      // console.log("new User", newUserData);
      // const UrI = Add_User + Add_User_EndPoint;
      // console.log("url", UrI)
      // axios.post(UrI, newUserData)
      //   .then((res) => {
      //     console.log(res);
      //     setMsg(res.data)
      //     Nav('/')
      //   })
      //   .catch((err) => { console.log(err) })
    }
  }
  return (
    <>
      <div className='flex flex-col gap-10 justify-center items-center h-screen bg-gray-200'>
        <form className='flex flex-col border p-10 items-center w-100'>
          <h1 className='font-bold text-4xl pb-4'>Login </h1>
          <p>{msg}</p>
          {/* Password */}
          {/* <InputField label={"username "} setValue={setusername} errorMessage={usernameError} type={"text"} /> */}
          <InputField label={"Email "} setValue={setEmail} errorMessage={emailError} type={"email"} />
          {/* Passeord  */}
          <InputField label={"Password "} setValue={setPassword} errorMessage={passwordError} type={"password"} />

          <button onClick={Submit} className='mt-5 p-1 bg-yellow-200 border rounded-lg '>Submit</button>
        </form>
      </div>
    </>
  )
}

export default Login