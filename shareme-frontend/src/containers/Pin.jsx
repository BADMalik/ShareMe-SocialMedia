import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar, CreatePin, Feed, Search, PinDetail } from '../components'
function Pin({ user }) {
    console.log(user, '12333333333')
    const [searchTerm, setSearchTerm] = useState(null)
    return (
        <div className='px-2 md:px-5'>
            <div className='bg-gray-50'>
                <Navbar searchTerm={searchTerm} user={user} setSearchTerm={setSearchTerm} />
            </div>
            <div className='h-full'>
                <Routes>
                    <Route path="/home" element={<Feed />} />
                    <Route path="/category/:categoryId" element={<Feed />} />
                    <Route path='/pin-detail/:pinId' element={<PinDetail user={user} />} />
                    <Route path='/create-pin' element={<CreatePin user={user} />} />
                    <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />

                </Routes>
            </div>
        </div>
    )
}

export default Pin
