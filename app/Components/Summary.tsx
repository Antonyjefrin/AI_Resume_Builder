import React from 'react'
import ScoreGauge from "~/Components/ScoreGauge";
import ScoreBadge from "~/Components/ScoreBadge";

const Category = ({title,score}: {title: string,score:number}) => {

    const textColor = score>70 ? 'text-green-500' :
        score>49 ? 'text-yellow-500' : 'text-red-500';

    return(
        <div className="resume-summary">
            <div className="category">
                 <div className="flex flex-row gap-2 items-center justify-center">
                     <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#020101] to-[#430BB7]">{title}</p>
                     <ScoreBadge score={score}/>
                 </div>
                <p className="text-2xl font-bold text-black">
                     <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({feedback}:{feedback:Feedback}) => {
    return (
        <div className="text-white rounded-2xl w-full"
             style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 8)' }}>
         <div className="flex flex-row gap-8 items-center p-4">
                <ScoreGauge score={feedback.overallScore}/>
             <div className="flex flex-col gap-2">
                 <h2 className="text-2xl font-bold">Your Resume Score</h2>
                <p className="text-sm text-white">
                    This score is calculated based on the variables below
                </p>
             </div>
          </div>
            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />

        </div>
    )
}
export default Summary
