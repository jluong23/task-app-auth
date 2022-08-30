import useTasksContext from "../hooks/useTasksContext";
import moment from 'moment';
import {ImBin, ImPencil} from 'react-icons/im'
import {FaSave} from 'react-icons/fa'
import useAuthContext from "../hooks/useAuthContext";
import { useState } from "react";

const TaskDetails = ({task}) => {
    const { dispatch } = useTasksContext();
    const { user } = useAuthContext();

    // states used for editing the task.
    // for printing original task properties, use attributes of task
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [color, setColor] = useState(task.color);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    const handleDelete = async () => {
        if(!user){
            return
        }
        const response = await fetch(`/api/tasks/${task._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if(response.ok){
            // update tasks context
            dispatch({
                type: 'DELETE_TASK',
                payload: json
            })
        }
    }

    const handleEditRequest = async () => {
        if(!user){
            return
        }  
        const editedTask = {title,description,color};

        const response = await fetch(`/api/tasks/${task._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedTask)
        });
        const json = await response.json();
        if(response.ok){
            // update tasks context
            dispatch({
                type: 'UPDATE_TASK',
                payload: json
            })
        }
    }


    const editModeOuput = (
        <div className="p-2 m-4 border-2 w-max">
            <form>
                <input 
                    onChange={(e) => setTitle(e.target.value)} 
                    value={title} 
                    type="text"    
                /><br/>
                <p className="font-semibold">{moment(task.updatedAt).format('LLL')}</p>
                <input 
                    onChange={(e) => setDescription(e.target.value)} 
                    value={description} 
                    type="email"    
                /><br/>
            </form>
            <div className="flex justify-between">
                <ImBin onClick={handleDelete} className="cursor-pointer text-lg"/>
                {/* make request and toggle edit mode when save button is pressed. */}
                <FaSave onClick={() => {handleEditRequest(); toggleEditMode();}} className="cursor-pointer text-lg"/>
                
            </div>
        </div>
    )

    const viewModeOutput = (
        <div className="p-2 m-4 border-2 w-max">
            <h2 className="font-bold">{task.title}</h2>
            <p className="font-semibold">{moment(task.updatedAt).format('LLL')}</p>
            <p className="my-2">{task.description}</p>
            <div className="flex justify-between">
            <ImBin onClick={handleDelete} className="cursor-pointer text-lg"/>
            {/* Toggle edit mode when pressed . */}
            <ImPencil onClick={() => {toggleEditMode()}} className="cursor-pointer text-lg"/>
            </div>
        </div>
    )
    
    return editMode ? editModeOuput : viewModeOutput;
}

export default TaskDetails;