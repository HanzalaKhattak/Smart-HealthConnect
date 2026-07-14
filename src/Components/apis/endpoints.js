// ───── Users / Patients ──────────────────────────────────
export const Add_User = '/postuser';
export const Login_User = '/UserLogin';
export const Get_User = '/getSpecificUser';     // append /:UserId
export const Update_User = '/updateUser';       // append /:UserId
export const Get_All_Users = '/getAllUser';
export const Delete_User = '/deleteUser';       // append /:UserId
export const Me_User = '/me';
export const Forgot_Password = '/password/forgot';
export const Reset_Password = '/password/reset';

// ───── Doctors ───────────────────────────────────────────
export const Register_Doctor = '/registerDoctor';
export const Doctor_Login = '/loginDoctor';
export const Update_Doctor = '/UpdateDoctor';   // append /:DoctorId
export const Get_All_Doctors = '/getAllDoctors';
export const Get_Specific_Doctor = '/getDoctor'; // append /:DoctorId
export const Delete_Doctor = '/deleteDoc';      // append /:_id
export const Approve_Doctor = '/approve';       // append /:DoctorId
export const Reject_Doctor = '/reject';         // append /:DoctorId
export const Set_Availability = '/setAvailability'; // append /:DoctorId
export const Get_Availability = '/getDoctor';   // append /:DoctorId/availability
export const Get_Doctor_Reviews = '/getDoctor'; // append /:DoctorId/reviews

// ───── Hospital admins ───────────────────────────────────
export const Register_HospitalAdmin = '/registerHospitalAdmin';
export const HospitalAdmin_Login = '/loginHospitalAdmin';
export const Get_All_HospitalAdmins = '/getAllHospAdmins';

// ───── Super / System admins ─────────────────────────────
export const Register_SuperAdin = '/registerSuperAdmin';
export const SuperAdmin_Login = '/authroute';

// ───── Appointments ──────────────────────────────────────
export const Create_Appointment = '/create';
export const Get_All_Appointments = '/all';
export const Get_Patient_Appointments = '/patient';
export const Get_Patient_Prescriptions = '/patient';
export const Get_Doctor_Appointments = '/doctor';
export const Get_Doctor_Today_Appointments = '/doctor/:doctorId/today';
export const Update_Appointment = '/update';
export const Cancel_Appointment = '/cancel';
export const Reschedule_Appointment = '/reschedule';
export const Rate_Appointment = '/rate';
export const Delete_Appointment = '/delete';
export const Get_Appointment_Stats = '/stats';
export const Video_Start = '/video';            // append /:id/start
export const Video_End = '/video';              // append /:id/end

// ───── Hospitals ─────────────────────────────────────────
export const Hospital_List = '/';
export const Hospital_Get = '/';                // append /:id
export const Hospital_Doctors = '/';            // append /:id/doctors

// ───── Notifications ─────────────────────────────────────
export const Notif_List = '/';
export const Notif_MarkRead = '/';              // append /:id/read
export const Notif_MarkAllRead = '/read-all';

// ───── Reviews ───────────────────────────────────────────
export const Review_Create = '/';
export const Review_Doctor = '/doctor';         // append /:doctorId

// ───── Medical records ───────────────────────────────────
export const MR_Upload = '/upload';
export const MR_ForPatient = '/patient';        // append /:patientId

// ───── Payments ──────────────────────────────────────────
export const Pay_Checkout = '/checkout';
export const Pay_Confirm = '/confirm';

// ───── AI Consultation (RAG) ─────────────────────────────
export const AI_Consult = '/consult';
export const AI_Sessions = '/sessions';           // GET list, append /:id for one
export const AI_Feedback = '/feedback';
export const AI_Admin_Ingest_Doctor = '/admin/ingest/doctor';       // append /:id
export const AI_Admin_Ingest_Hospital = '/admin/ingest/hospital';   // append /:id
export const AI_Admin_Ingest_Knowledge = '/admin/ingest/knowledge';
export const AI_Admin_Reindex_All = '/admin/reindex-all';
export const AI_Admin_Stats = '/admin/stats';
