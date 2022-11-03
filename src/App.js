import React, { useState, useEffect } from 'react'
import Editor from "./components/Editor/Editor"
import Sidebar from "./components/Sidebar/Sidebar"
import { data } from "./data"
// split plane for user to manipulate
import Split from "react-split"
// create random id
import {nanoid} from "nanoid"
import "react-mde/lib/styles/css/react-mde-all.css";

export default function App() {
    const [notes, setNotes] = useState(
        // lazy state initialization
        // stop 'notes' state so it doesn't reach into localstorage on every single re-render of the App component
        () => JSON.parse(localStorage.getItem("notes")) || [])
    const [currentNoteId, setCurrentNoteId] = useState(
        // make sure notes at index 0 exists before trying to access id
        (notes[0] && notes[0].id) || ""
    )

    // sync note with localstorage
    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
  
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [
            newNote, 
            ...prevNotes
        ])
        setCurrentNoteId(newNote.id)
    }   
  
    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i ++){
                const oldNote = oldNotes[i]
                // if id matches
                if(oldNote.id === currentNoteId){
                    // put the updated note a the beginning of the new array
                    newArray.unshift({
                        ...oldNote,
                        body: text
                    })
                } else {
                    // push old note to the end of the new array
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }
  
    function deleteNote(event, noteId){
        // stops an event from bubbling or propagatng up the DOM tree
        event.stopPropagation()
        // filter takes a callback function, boolean
            // whether current item iterating from original item should be included in the new array
        // for each note, note id property does not equal note id we are trying to delete
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
             >
            <Sidebar
                notes={notes}
                currentNote={findCurrentNote()}
                setCurrentNoteId={setCurrentNoteId}
                newNote={createNewNote}
                deleteNote={deleteNote}
            />
            {
                currentNoteId && 
                notes.length > 0 &&
                <Editor 
                    currentNote={findCurrentNote()} 
                    updateNote={updateNote} 
                />
            }
        </Split>
        :
        <div className="no-notes">
            <h1>You have no notes</h1>
            <button 
                className="first-note" 
                onClick={createNewNote}
            >
                Create one now
            </button>
        </div> 
        }
        </main>
    )
}
