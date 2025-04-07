import { useState, useEffect } from "react";
import axios from "axios";
import BodyButton from '../../buttons/BodyButton.js';
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import ProjectSkillCreateForm from "./ProjectSkillCreateForm.js";
import ProjectPhotoCreateForm from "./ProjectPhotoCreateForm.js";

function ProjectDetails({ fetchProjectsData, onBack, selectedProject, setSelectedProject, onDeleteSkill }) {
    const [isProjectSkillCreateFormHidden, setIsProjectSkillCreateFormHidden] = useState(true);
    const [isProjectPhotoCreateFormHidden, setIsProjectPhotoCreateFormHidden] = useState(true);

    
    async function handleUpdateProjectChange(e) {
        const { name, type, value, checked } = e.target;
        setSelectedProject({
            ...selectedProject,
            [name]: type === "checkbox" ? checked : value
        });
    }


    async function handleProjectUpdateSubmit(e) {
        console.log("hit")
        e.preventDefault();
        const response = await axios.patch(`
            ${process.env.REACT_APP_API_URL}project/update/${selectedProject._id}`,
            selectedProject,
            {
                withCredentials: true
            }
        );
        alert(response.data.message);
        fetchProjectsData();
    };


    async function toggleProjectSkillCreateForm(e) {
        e.preventDefault();
        const projectSkillCreateForm = document.getElementById('projectSkillCreateForm');
        const buttonRect = e.target.getBoundingClientRect();
        const formRect = projectSkillCreateForm.getBoundingClientRect();
        setIsProjectSkillCreateFormHidden((prev) => !prev);
        projectSkillCreateForm.style.top = `${buttonRect.bottom + window.scrollY}px`;
        projectSkillCreateForm.style.left = `${buttonRect.left + (buttonRect.width/2) + window.scrollX - (formRect.width/2)}px`;
    };
    

    async function toggleProjectPhotoCreateForm(e) {
        e.preventDefault();
        const projectPhotoCreateForm = document.getElementById('projectPhotoCreateForm');
        const buttonRect = e.target.getBoundingClientRect();
        const formRect = projectPhotoCreateForm.getBoundingClientRect();
        setIsProjectPhotoCreateFormHidden((prev) => !prev);
        projectPhotoCreateForm.style.top = `${buttonRect.bottom + window.scrollY}px`;
        projectPhotoCreateForm.style.left = `${buttonRect.left + (buttonRect.width/2) + window.scrollX - (formRect.width/2)}px`;
    };


    async function handleProjectPhotoDeleteSubmit(e, projectPhotoId) {
        e.preventDefault();
        const response = (await axios.delete(
            `${process.env.REACT_APP_API_URL}projectphoto/delete/${projectPhotoId}`,
            {
                withCredentials: true
            }
        )).data;
        alert(response.message);
        fetchProjectsData();
    };


    return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
        <div className="w-full flex items-center justify-start gap-4">
        <BodyButton onClick={() => onBack(null)}>←</BodyButton>
        <p className="inline-block text-2xl font-semibold flex-1">{selectedProject.title}</p>
        </div>
        <form onSubmit={handleProjectUpdateSubmit} className="w-full flex flex-col justify-center items-center gap-2">
            <div className="w-full flex justify-start items-center gap-2">
                <label className="whitespace-nowrap">Title: </label>
                <input name="title" onChange={handleUpdateProjectChange} value={selectedProject.title} className="border p-2 rounded-[10px] w-full" />
            </div>
            <div className="w-full flex justify-start items-center gap-2">
                <label className="whitespace-nowrap">ShortDescription: </label>
                <input name="shortDescription" onChange={handleUpdateProjectChange} value={selectedProject.shortDescription} className="border p-2 rounded-[10px] w-full" />
            </div>
            <div className="w-full flex justify-start items-center gap-2">
                <label className="whitespace-nowrap">Long Description: </label>
                <input name="longDescription" onChange={handleUpdateProjectChange} value={selectedProject.longDescription} className="border p-2 rounded-[10px] w-full" />
            </div>
            <button type="submit" className="px-2 py-1 border rounded-full w-fit">Save</button>
        </form>

        <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2">
            <p className="font-semibold">Project Skills</p>
            <button onClick={toggleProjectSkillCreateForm} className="text-2xl text-blue-500">+</button>
        </div>
        <div className="w-full flex justify-start items-center gap-[10px]">
            {selectedProject.projectSkills?.map((skill) => (
            <div key={skill._id} className="flex justify-start items-center">
                <p className="whitespace-nowrap">• {skill.name}</p>
                <button onClick={() => onDeleteSkill(skill._id)} className="w-[20px] h-[20px] border rounded-full p-[2px] text-xs bg-red-200">X</button>
            </div>
            ))}
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="flex justify-center items-center gap-2 md:col-span2 xl:col-span-3">
                <p className="font-semibold">Project Photos</p>
                <button onClick={toggleProjectPhotoCreateForm} className="text-2xl text-blue-500">+</button>
            </div>
            {selectedProject.projectPhotos?.map((photo) => (
                <div>
                    <img key={photo._id} src={photo.value} className="w-[300px] h-[300px] object-cover rounded-[10px]" />
                    <form onSubmit={(e) => handleProjectPhotoDeleteSubmit(e, photo._id)}>
                        <button className="px-2 py-1 border rounded-full bg-red-200">Delete</button>
                    </form>
                </div>
            ))}
        </div>

        <ProjectSkillCreateForm fetchProjectsData={fetchProjectsData} selectedProject={selectedProject} toggleForm={toggleProjectSkillCreateForm} isHidden={isProjectSkillCreateFormHidden} />
        <ProjectPhotoCreateForm fetchProjectsData={fetchProjectsData} selectedProject={selectedProject} toggleForm={toggleProjectPhotoCreateForm} isHidden={isProjectPhotoCreateFormHidden} />
            
    </div>
    );
}

export default ProjectDetails;