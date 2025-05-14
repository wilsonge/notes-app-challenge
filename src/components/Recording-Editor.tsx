import { Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import { Formik } from "formik";
import { INoteEditableData } from "../types.ts";

type RecordingEditorProps = {
    onDismiss: () => void;
    title?: string;
    text: string;
    onSave: (values: INoteEditableData) => Promise<void>;
    dialogOpen: boolean;
}

const RecordingEditor = (props: RecordingEditorProps) => (
    <Dialog open={props.dialogOpen} onClose={() => props.onDismiss()} className="dialog">
        <DialogHeading className="text-v1-teal heading">{props.title ? "Edit Note" : "Create Note"}</DialogHeading>
        <Formik
            initialValues={{
                title: props.title || "",
                text: props.text
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                props.onSave({
                    title: values.title || `${values.text.substr(0, 20)}...`,
                    text: values.text
                });
                setSubmitting(false);
                resetForm();
                props.onDismiss();
            }}
        >
            {({ values, handleSubmit, isSubmitting, handleChange }) => (
                <form onSubmit={handleSubmit}>
                    <div className="overflow-scroll p-4 form-inputs">
                        <div className="mb-4">
                            <label className="text-v1-teal mb-1" htmlFor="noteTitle">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="noteTitle"
                                value={values.title}
                                onChange={handleChange}
                                className="text-v1-teal bg-v1-putty"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-v1-teal mb-1" htmlFor="noteContents">Note</label>
                            <textarea
                                name="text"
                                id="noteContents"
                                value={values.text}
                                onChange={handleChange}
                                className="text-v1-teal bg-v1-putty resize-y w-full min-h-[80px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center mt-6">
                        <DialogDismiss
                            onClick={() => {
                                props.onDismiss();
                            }}
                            style={{ marginRight: "8px" }}
                            className="me-2 bg-v1-teal"
                        >
                            Cancel
                        </DialogDismiss>
                        <DialogDismiss
                            type="submit" disabled={isSubmitting}
                            className="bg-v1-teal"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </DialogDismiss>
                    </div>
                </form>
            )}
        </Formik>
    </Dialog>
);

export default RecordingEditor;
