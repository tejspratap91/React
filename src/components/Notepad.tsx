import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/Notepad.css'

interface Note {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

function Notepad() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setTitle(newNote.title)
    setContent(newNote.content)
  }

  const updateNote = () => {
    if (selectedNote) {
      setNotes(
        notes.map((note) =>
          note.id === selectedNote.id
            ? { ...note, title, content, updatedAt: new Date() }
            : note
        )
      )
      setSelectedNote({ ...selectedNote, title, content, updatedAt: new Date() })
    }
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setTitle('')
      setContent('')
    }
  }

  const selectNote = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="notepad-container">
      <h2>Notepad</h2>

      <div className="notepad-layout">
        <div className="notepad-sidebar">
          <button onClick={createNewNote} className="notepad-new-btn">
            + New Note
          </button>

          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="notepad-search"
          />

          <div className="notes-list">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => selectNote(note)}
                >
                  <h4 className="note-item-title">{note.title}</h4>
                  <p className="note-item-preview">{note.content.substring(0, 50)}...</p>
                  <small className="note-item-date">{formatDate(note.updatedAt)}</small>
                </div>
              ))
            ) : (
              <p className="empty-message">No notes found</p>
            )}
          </div>
        </div>

        <div className="notepad-editor">
          {selectedNote ? (
            <>
              <div className="editor-header">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={updateNote}
                  className="editor-title"
                  placeholder="Note title..."
                />
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="notepad-delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={updateNote}
                className="editor-content"
                placeholder="Start typing your note..."
              />

              <div className="editor-info">
                <span>Created: {formatDate(selectedNote.createdAt)}</span>
                <span>Updated: {formatDate(selectedNote.updatedAt)}</span>
                <span>Words: {content.split(/\s+/).filter((w) => w).length}</span>
              </div>
            </>
          ) : (
            <div className="editor-empty">
              <p>Select a note or create a new one to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notepad
