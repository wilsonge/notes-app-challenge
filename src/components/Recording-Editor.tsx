import { Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import { Formik } from "formik";
import { INoteEditableData } from "../types.ts";
import { FC } from "react";
import { Alert, TextField, TextAreaField } from "@aws-amplify/ui-react";

type RecordingEditorProps = {
    onDismiss: () => void;
    title?: string;
    error?: string;
    text: string;
    onSave: (values: INoteEditableData) => Promise<void>;
    dialogOpen: boolean;
}

const RecordingEditor: FC<RecordingEditorProps> = (props: RecordingEditorProps) => (
    <Dialog open={props.dialogOpen} onClose={() => props.onDismiss()} className="dialog fixed z-50 m-auto flex flex-col gap-4 overflow-auto bg-white text-black p-4 h-fit">
        <DialogHeading className="text-v1-teal heading text-2xl">{props.title ? "Edit Note" : "Create Note"}</DialogHeading>
        {props.error && props.error !== '' ? <Alert
            variation='error'
            isDismissible={true}
            hasIcon={true}
            heading="Error"
        >
            {props.error}
        </Alert> : ''}
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
                    <div className="overflow-scroll p-4 form-inputs max-h-[450px] sm:max-h-[300px]">
                        <div className="mb-4">
                            <TextField
                                type="text"
                                label="Title"
                                name="title"
                                id="noteTitle"
                                value={values.title}
                                onChange={handleChange}
                                className="block p-2.5 w-full text-v1-midnight bg-gray-50 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <TextAreaField
                                name="text"
                                label="Note"
                                id="noteContents"
                                value={values.text}
                                onChange={handleChange}
                                placeholder="Write your thoughts here..."
                                className="block p-2.5 w-full text-sm text-v1-midnight bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                autoResize={true}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center mt-6">
                        <DialogDismiss
                            onClick={() => {
                                props.onDismiss();
                            }}
                            className="me-2 bg-v1-teal p-2 text-white"
                        >
                            Cancel
                        </DialogDismiss>
                        <DialogDismiss
                            type="submit" disabled={isSubmitting}
                            className="bg-v1-teal p-2 text-white"
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
