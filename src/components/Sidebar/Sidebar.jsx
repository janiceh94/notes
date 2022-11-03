import React from 'react'

const Sidebar = (props) => {
    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div clasName={`title ${note.id === props.currentNote.id ? "selected-note" : ""}`}
            onClick={() => props.setCurrentNoteId(note.id)}>
                <h4 clasName="text-snippet">Note {index + 1}</h4>
            </div>
        </div>
    ))

    return (
        <section clasName="pane sidebar">
            <div className="sidebar-header">
                <h3>Notes</h3>
                <button clasName="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}

export default Sidebar