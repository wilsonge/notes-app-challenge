import { useState, useEffect } from "react";

import Note from "./Note";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { INoteEditableData } from "../types.ts";

const client = generateClient<Schema>();

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
        <div className="max-w-[800px] w-[100%] my-4 mx-auto">
            {notes.map((note: Schema["Note"]["type"]) => (
                <Note
                    {...note}
                    onSaveChanges={async (values: INoteEditableData) => {
                        if (values == null) {return}
                        const updatedData = {
                            ...note,
                            ...values,
                            'updatedAt': Date.now().toString(),
                        }
                        const { data: updatedNote, errors } =  await client.models.Note.update(updatedData);

                        // TODO: We should show parts of this to the user.
                        if (errors) {
                            console.error(errors)
                            return;
                        }

                        // TODO: Show an error to the user to indicate something went wrong. We could try using the
                        //       data we wanted to upsert with in this case potentially.
                        if (updatedNote == null) {
                            console.error('Failed to retrieve updated record from the update');
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
        </div>
    );
};

export default NotesComponent;
