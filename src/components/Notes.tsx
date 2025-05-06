import { useState, useEffect } from "react";
import styled from "@emotion/styled";

import Note from "./Note";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

type NoteEditableData = {
    title: string;
    text: string;
}

interface Note extends NoteEditableData {
    id: string;
    createdAt: string;
    updatedAt: string;
}

const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;

const NotesComponent = () => {
    const [notes, setNotes] = useState<Note[]>([]);

    const fetchNotes = async () => {
        const { data: items, errors } = await client.models.Note.list();
        // TODO: Better error handling
        if (errors) {}
        // @ts-ignore
        setNotes(items);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <Container>
            {notes.map((note: Note) => (
                <Note
                    key={note.id}
                    {...note}
                    onSaveChanges={async (values: NoteEditableData) => {
                        if (values == null) {return}
                        // @ts-ignore
                        const { data: updatedNote, errors } =  await client.models.Note.update(values);
                        // TODO: Better error handling
                        if (errors) {
                            return;
                        }
                        // TODO: Better error handling
                        if (updatedNote == null) {
                            return;
                        }
                        setNotes(
                            // @ts-ignore
                            notes.map(n => {
                                return n.id === note.id ? updatedNote : n;
                            })
                        );
                    }}
                    onDelete={async () => {
                        await client.models.Note.delete({id: note.id})

                        setNotes(notes.filter(n => n.id !== note.id));
                    }}>

                </Note>
            ))}
        </Container>
    );
};

export default NotesComponent;
