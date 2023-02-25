import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate()
    if (!user) return null

    console.log(searchTerm)
    return (
        <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
            <div className='flex items-center justify-start w-full px-2 rounded-md outline-none shadow-md bg-white border-none gap-2'>
                <IoMdSearch fontSize={21} className="ml-1" />
                <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Search' className='w-full p-2 bg-white outline-none' value={searchTerm || ''} onFocus={() => navigate('/search')} />
            </div>
            <div className='flex gap-3'>
                <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                    <img src={user.image} alt="user" className='w-14 h-12 rounded-lg' />
                </Link>
                <Link to={`/create-pin`} className="bg-slate-800 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center">
                    <IoMdAdd />
                </Link>
            </div>
        </div>
    )
}

export default Navbar