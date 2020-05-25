import { authHeader } from "../helpers/authHeader";

const getHighlights = async () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return await fetch('http://localhost:6607/api/Highlights', requestOptions)
        .then(res => res.status === 200 && res.text())
        .then(text => JSON.parse(text))
        .catch(err => console.log(err))
}

const addHighlight = async highlight => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({...highlight, userId})
    };

    return await fetch('http://localhost:6607/api/Highlights', requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const updateHighlight = async highlight => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({...highlight, userId})
    };

    return await fetch(`http://localhost:6607/api/Highlights/${highlight.id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const deleteHighlight = async id=> {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/Highlights/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const getHighlightsHistory = async () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return await fetch('http://localhost:6607/api/HighlightsHistory/annually', requestOptions)
        .then(res => res.status === 200 && res.text())
        .then(text => JSON.parse(text))
        .catch(err => console.log(err))
}

const deleteHighlightHistory = async id => {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    }

    return await fetch(`http://localhost:6607/api/HighlightsHistory/${id}`, requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

const addHighlightHistory = async (highlightId, date) => {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({date, highlightId})
    }

    return await fetch('http://localhost:6607/api/HighlightsHistory', requestOptions)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

export const highlightService = {
    getHighlights,
    addHighlight,
    updateHighlight,
    deleteHighlight,
    getHighlightsHistory,
    addHighlightHistory,
    deleteHighlightHistory
}