export const Add_User = '/postuser' //add new user
export const Login_User = '/UserLogin' //login user 
export const Get_User = '/getSpecificUser' // get specific user
export const Update_User = '/updateUser' // update user
export const Get_All_Users = '/getAllUser' // get all users

export const Register_Doctor = '/registerDoctor' //register doctor
export const Doctor_Login = '/loginDoctor' // Login Doctor
export const Update_Doctor = '/UpdateDoctor' // update Doctor (append /:DoctorId)
export const Get_All_Doctors = '/getAllDoctors' // get All doctors
export const Get_Specific_Doctor = '/getDoctor' // get specific doctor (append /:DoctorId)
export const Delete_Doctor = '/deleteDoc' // delete doctor

export const Register_HospitalAdmin = '/registerHospitalAdmin' // register Hospital Admin
export const HospitalAdmin_Login = '/loginHospitalAdmin' //Hospital Admin Login
export const Get_All_HospitalAdmins = '/getAllHospAdmins' // get all hospital admins

export const Register_SuperAdin = '/registerSuperAdmin';// register superadmin
export const SuperAdmin_Login = '/authroute'

// Appointment endpoints
export const Create_Appointment = '/create' // create appointment
export const Get_All_Appointments = '/all' // get all appointments
export const Get_Patient_Appointments = '/patient' // get patient appointments
export const Get_Doctor_Appointments = '/doctor' // get doctor appointments
export const Get_Doctor_Today_Appointments = '/doctor/:doctorId/today' // get today's appointments
export const Update_Appointment = '/update' // update appointment
export const Cancel_Appointment = '/cancel' // cancel appointment
export const Delete_Appointment = '/delete' // delete appointment
export const Get_Appointment_Stats = '/stats' // get appointment statistics