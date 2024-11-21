import { useEffect, useState } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/home.css";
const Home = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const getNotes = async () => {
        try {
            const response = await api.get("/api/notes/");
            const data = await response.data;
            console.log(data);
            setNotes(data);
        } catch (error) {
            alert(error);
        }
    };
    useEffect(() => {
        getNotes();
    }, []);

    const deleteNote = async (id) => {
        try {
            const response = await api.delete(`/api/notes/delete/${id}/`);
            if (response.status === 204) getNotes();
            else alert("Failed");
        } catch (error) {
            alert(error);
        }
    };

    const createNote = async (e) => {
        try {
            e.preventDefault();
            const response = await api.post("/api/notes/", { content, title });
            if (response.status === 201) getNotes();
            else alert("Failed");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note key={note.id} note={note} onDelete={deleteNote} />
                ))}
            </div>
            <h2>Create</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    type="text"
                    id="content"
                    name="content"
                    required
                    onChange={(e) => setContent(e.target.value)}
                    value={content}></textarea>
                <br />

                <input type="submit" value="submit" />
            </form>
        </div>
    );
};

export default Home;
