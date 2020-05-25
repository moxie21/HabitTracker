import { authHeader } from "../helpers/authHeader";

const addTask = async taskData => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ ...taskData, userId})
    }

    return await fetch('http://localhost:6607/api/Tasks', requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const deleteTask = async id => {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/Tasks/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const getTasksHistory = async (startDate,endDate) => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/Tasks/${startDate}/${endDate}`, requestOptions)
        .then(res => res.status === 200 && res.text())
        .then(text => JSON.parse(text))
        .catch(err => console.log(err))
}

const addTasksHistory = async (date, taskId) => {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({date, taskId})
    }

    return await fetch('http://localhost:6607/api/TasksHistory', requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const deleteTaskHistory = async id => {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/TasksHistory/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

export const tasksService = {
    addTask,
    deleteTask,
    getTasksHistory,
    addTasksHistory,
    deleteTaskHistory,
}