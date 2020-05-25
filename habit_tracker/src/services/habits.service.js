import { authHeader } from "../helpers/authHeader";

const getHabits = async () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return await fetch('http://localhost:6607/api/Habits', requestOptions)
        .then(res => res.status === 200 && res.text())
        .then(text => JSON.parse(text))
        .catch(err => console.log(err))
}

const addHabit = async habit => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({...habit, userId})
    };

    return await fetch('http://localhost:6607/api/Habits', requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const updateHabit = async habit => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({...habit, userId})
    };

    return await fetch(`http://localhost:6607/api/Habits/${habit.id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const deleteHabit = async id => {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/Habits/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const getHabitsHistory = async (startDate, endDate) => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/HabitsHistory/${startDate}/${endDate}`, requestOptions)
        .then(res => res.status === 200 && res.text())
        .then(text => JSON.parse(text))
        .catch(err => console.log(err))
}

const addHabitHistory = async (habitId, date, status) => {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({date, habitId, status})
    }

    return await fetch('http://localhost:6607/api/HabitsHistory', requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const updateHabitHistory = async (id, habit) => {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(habit)
    }

    return await fetch(`http://localhost:6607/api/HabitsHistory/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const deleteHabitHistory = async id => {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/HabitsHistory/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const getHabitsHistoryAnnually = async () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return await fetch('http://localhost:6607/api/HabitsHistory/annually', requestOptions)
        .then(res => res.status === 200 && res.text())
        .then(text => JSON.parse(text))
        .catch(err => console.log(err))
}


export const habitService = {
    getHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitsHistory,
    addHabitHistory,
    updateHabitHistory,
    deleteHabitHistory,
    getHabitsHistoryAnnually
}