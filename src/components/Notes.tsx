import { useState, useEffect } from "react";
import styled from "@emotion/styled";

import Note from "./Note";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;

const NotesComponent = () => {
    const [notes, setNotes] = useState<Schema["Note"]["type"][]>([]);

    const fetchNotes = async () => {
        const { data: items, errors } = await client.models.Note.list();
        // TODO: Better error handling
        if (errors) {}
        setNotes(items);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <Container>
            {notes.map(note => (
                // @ts-ignore
                <Note
                    key={note.id}
                    {...note}
                    onSaveChanges={async (values: Schema["Note"]["type"]) => {
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
                            notes.map(n => {
                                return n.id === note.id ? updatedNote : n;
                            })
                        );
                    }}
                    onDelete={async () => {
                        await client.models.Note.delete({id: note.id})

                        setNotes(notes.filter(n => n.id !== note.id));
                    }}></Note>
            ))}
        </Container>
    );
};

export default NotesComponent;
