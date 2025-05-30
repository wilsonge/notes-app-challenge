interface INoteEditableData {
    title: string;
    text: string;
}

/** Additional type for data that must be saved but is not user editable */
interface INoteData extends  INoteEditableData {
}

export type {
    INoteEditableData,
    INoteData,
}
