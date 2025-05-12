interface INoteEditableData {
    title: string;
    text: string;
}

// This is a duplicate of Schema["Note"]["type"] but is extensible.
interface INote extends INoteEditableData {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type {
    INoteEditableData,
    INote,
}
