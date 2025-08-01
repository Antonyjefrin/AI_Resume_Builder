import type { Route } from "./+types/home";
import NavBar from "~/Components/NavBar";
import Dots from "~/Components/Dots";
import ResumeCard from "~/Components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

    const {auth,kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);


    useEffect(()=>{
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            console.log("parsedResumes :",parsedResumes);
            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }

        loadResumes()
    }, []);


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

                  {!loadingResumes && resumes.length===0?(
                      <h2 className="text-amber-50 ">No resume found. Upload your first resume to get feedback</h2>
                  ):(
                      <h2 className="text-amber-50 ">Review submissions and check AI-powered feedback</h2>
                  )}

              </div>

              {loadingResumes && (
                  <div className="flex flex-col items-center justify-center">
                      <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="img-scan" />
                  </div>
              )}


              {!loadingResumes && resumes.length > 0 && (
                  <div className="resumes-section ">
                      {resumes.map((resume) => (
                          <ResumeCard key={resume.id} resume={resume} />
                      ))}
                  </div>
              )}

              {!loadingResumes && resumes?.length === 0 && (
                  <div className="flex flex-col items-center justify-center mt-10 gap-4">
                      <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                          Upload Resume
                      </Link>
                  </div>
              )}

  </section>
  </main>

}
