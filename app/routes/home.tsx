import type { Route } from "./+types/home";
import NavBar from "~/Components/NavBar";
import Dots from "~/Components/Dots";
import {resumes} from "../../constants";
import ResumeCard from "~/Components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

    const {auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated]);


    return <main className="relative bg-[url('/images/bg-ok.png')] bg-cover bg-center rounded-none">
      <div

          className="absolute inset-0 z-10">
          <Dots/>
      </div>

          <div className="relative z-40">
              <NavBar />
          </div>

          <section className="main-section ">
              <div className="relative page-heading z-40">
                  <h1
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#AB8C95] via-[#ffffff]  to-[#8E97C5]"
                  >Track Your Applications <br /> & Resume Ratings</h1>
                  <h2 className="text-amber-50 ">Review submissions and check AI-powered feedback</h2>
              </div>


      {resumes.length > 0 && (
          <div className="resumes-section ">
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
              ))}
          </div>
      )}

  </section>
  </main>

}
