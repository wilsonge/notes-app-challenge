interface INoteEditableData {
    title: string;
    text: string;
}

interface INoteData extends  INoteEditableData {
    summary: string;
}

export type {
    INoteEditableData,
    INoteData,
}
