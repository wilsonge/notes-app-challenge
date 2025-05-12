import { useState, useEffect } from "react";
import styled from "@emotion/styled";

import Note from "./Note";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { INoteEditableData } from "../types.ts";

const client = generateClient<Schema>();

const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;

const NotesComponent = () => {
    const [notes, setNotes] = useState<Schema["Note"]["type"][]>([]);

    const fetchNotes: () => Promise<void> = async () => {
        const { data: items, errors } = await client.models.Note.list();
        // TODO: Better error handling
        if (errors) {
            console.log(errors);
            return;
        }
        setNotes(items);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <Container>
            <h2>Here are your notes</h2>
            {notes.map((note: Schema["Note"]["type"]) => (
                <Note
                    key={note.id}
                    {...note}
                    onSaveChanges={async (values: INoteEditableData) => {
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
