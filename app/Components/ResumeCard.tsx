import React from 'react'
import {Link} from "react-router";
import ScoreCircle from "~/Components/ScoreCircle";

const ResumeCard = ({resume:{id, companyName, jobTitle,feedback,imagePath}} : {resume: Resume}) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000 z-40">

            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <h3 className="text-lg text-gray-500  break-words">{jobTitle}</h3>
                </div>

                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore}/>
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000 overflow-hidden">
                 <div className='h-full w-full'>
                      <img
                      src={imagePath}
                      alt="resume"
                      className="w-full h-[350px] max-sm:h-[250px] object-cover object-top "
                      />
                 </div>
            </div>


        </Link>
    )
}
export default ResumeCard
