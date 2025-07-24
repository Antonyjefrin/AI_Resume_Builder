import React from 'react'
import {Link} from "react-router";

const NavBar = () => {
    return (
       <nav className="navbar z-40">

           <Link  to="/">
               <p className="text-2xl font-bold bg-clip-text text-transparent
               bg-gradient-to-r from-[#AB8C95] via-[#000000] to-[#8E97C5]">RESUMIND</p>
           </Link>

           <Link to="/upload" className="primary-button w-fit" >
               Upload resume
           </Link>

       </nav>
    )
}
export default NavBar
