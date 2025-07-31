import {Link, useNavigate, useParams} from "react-router";
import Dots from "~/Components/Dots";
import React, {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import ATS from "~/Components/ATS";
import Details from "~/Components/Details";
import Summary from "~/Components/Summary";

const Resume = () => {

    const {id} = useParams();
    const {auth,isLoading,kv,fs} = usePuterStore();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback|null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])


    useEffect(()=>{

        const loadResume = async ()=>{
             const resume = await kv.get(`resume:${id}`);
             if(!resume) return;

             const data = JSON.parse(resume);

             const resumeBlob = await fs.read(data.resumePath);
             if(!resumeBlob) return;

             const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
             const resumeUrl = URL.createObjectURL(pdfBlob);
             setResumeUrl(resumeUrl);

             const imageBlob = await fs.read(data.imagePath);
             if(!imageBlob) return;
             const imageUrl = URL.createObjectURL(imageBlob);
             setImageUrl(imageUrl);
             setFeedback(data.feedback);

             console.log({imageUrl,resumeUrl,feedback:data.feedback});

        }

        loadResume();

    },[id])

    return (
        <main className="!p=0">
            <div

                className="absolute inset-0 z-10">
                <Dots/>
            </div>

            <nav className="resume-nav relative z-30">
                <Link to="/" className="back-button">
                      <img src="/icons/back.svg" alt="logo" className="h-4 w-4 text-white" />
                      <span className="text-white font-semibold">Back to HomePage</span>
                </Link>
            </nav>

            <div className="relative z-30 flex flex-row w-full max-lg:flex-col-reverse">
                <section className="relative z-30 feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">

                    {imageUrl && resumeUrl && (
                        <div className="relative z-30 animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                    alt="img"
                                />
                            </a>
                        </div>
                    )}

                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl font-bold text-white">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                             <Summary feedback={feedback} />
                             <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips} />
                             <Details feedback={feedback}/>
                        </div>
                        ):

                        (
                        <img src="/images/resume-scan-2.gif" className="w-full" alt="image" />
                    )}
                </section>
            </div>

        </main>
    )
}
export default Resume
