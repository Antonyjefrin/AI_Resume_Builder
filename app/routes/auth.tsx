import React, {useEffect} from 'react'
import Dots from "~/Components/Dots";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";

export const meta = ()=>([
    {title: 'Resumind | Auth'},
])

const Auth = () => {


    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(()=>{
       if(auth.isAuthenticated) navigate(next);
    },[auth.isAuthenticated,next]);

    return (
        <main className="relative bg-[url('/images/bg-ok.png')] bg-cover min-h-screen flex items-center justify-center">
            <div
                className="absolute inset-0 z-10">
                <Dots/>
            </div>

            <div className=" relative z-30">
                <section className='p-10 flex flex-col bg-white rounded-2xl text-center gap-4'>

                    <div>
                        <h1 className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#AB8C95]  to-[#8E97C5]">
                            Welcome
                        </h1>
                        <h2 className="text-[2vh]">Login to continue your job journey</h2>
                    </div>


                    <div>
                        {isLoading ? (
                                <button className="auth-button animate-pulse">
                                    Signing in...
                                </button>
                            ):
                            <>

                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut} >
                                    Log Out
                                </button>
                            ):
                                (
                                    <button className="auth-button" onClick={auth.signIn} >
                                        Log In
                                    </button>
                                )
                            }

                            </>
                        }
                    </div>
                </section>



            </div>

        </main>
    )
}
export default Auth
