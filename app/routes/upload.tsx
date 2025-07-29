import React, {type FormEvent, useState} from 'react'
import Dots from "~/Components/Dots";
import NavBar from "~/Components/NavBar";
import Uploader from "~/Components/Uploader";
import {usePuterStore} from "~/lib/puter";
import {useLocation} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {

    const{auth,fs,isLoading,ai,kv} = usePuterStore();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File|null>(null);

    const handelFileSelect = (file:File|null)=>{
        setFile(file)
    }


    const handleAnalyze = async ({companyName,jobTitle,jobDescription,file}: { companyName:string,jobTitle:string,jobDescription:string,file:File }) => {

        setIsProcessing(true);
        setStatusText("Uploading the file....")
        const uploadedFile = await fs.upload([file]);

        if(!uploadedFile) return setStatusText("Error: Failed to upload");
        setStatusText("Converting to image");
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText("Error: Failed to convert image to pdf");

        setStatusText("uploading the image....");
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Error: Failed to upload");

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id : uuid,
            resumePath : uploadedFile.path,
            imagePath : uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: ''
        }

        await kv.set(`resume:${uuid}`,JSON.stringify(data));
        setStatusText("Analysing....");

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription})
        );

        if (!feedback) return setStatusText("Error: Failed to upload");

        const feedbackText = typeof feedback.message.content === "string"
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);

    }

    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{

        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;

        const  formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

       if(!file) return;
       handleAnalyze({companyName, jobTitle, jobDescription, file})

    }



    // @ts-ignore
    return (
        <main className="relative bg-[url('/images/bg-ok.png')] bg-cover bg-center rounded-none">
            <div

                className="absolute inset-0 z-10">
                <Dots/>
            </div>

            <div className="relative z-40">
                <NavBar />
            </div>

            <section className="relative main-section z-20 ">
                <div className="page-heading ">
                     <h1
                     className=" bg-clip-text text-transparent bg-gradient-to-r from-[#AB8C95] via-[#ffffff]  to-[#8E97C5]"
                     >Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                        <h2 className="text-white ">{statusText}</h2>
                        <img src="/images/resume-scan.gif" alt="resume_gif" className="w-full " />
                        </>
                    ):(
                        <h2 className="text-white"></h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit}>
                            <div className="form-div">
                                 <label htmlFor="company-name">Company Name</label>
                                <input className="placeholder:text-black/60 font-bold" type="text" name="company-name" placeholder="company name" id="company-name" />

                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job title</label>
                                <input className="placeholder:text-black/60 font-bold" type="text" name="job-title" placeholder="job title" id="job-title" />

                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job description</label>
                                <textarea className="placeholder:text-black/60 font-bold" rows={5} name="job-description" placeholder="job description" id="job-description" />

                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload resume</label>
                                <Uploader onFileSelect={handelFileSelect}/>
                            </div>

                            <button className="primary-button" type="submit">
                                 Analyze resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
            </main>
    )
}
export default Upload
