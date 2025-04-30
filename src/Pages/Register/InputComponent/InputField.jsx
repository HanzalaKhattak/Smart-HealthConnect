

const InputField = ({label,setValue,errorMessage,type}) => {
    return (
      <section className=' flex flex-col gap-2'>
        {/* First Name */}
        <label htmlFor="username">{label} :</label>
        <input type={type} onChange = {(e)=> setValue(e.target.value)} placeholder={` ${label}`} className='border rounded w-60' />
        <p className="text-red-600 w-60">{errorMessage}</p>
      </section>
    )
  }
  
  export default InputField