import { Dialog, DialogHeading, DialogDismiss } from "@ariakit/react";
import { PropsWithChildren, useState } from "react"

interface DialogComponentProps extends PropsWithChildren<{}> {
    onDismiss: () => void;
}

const DialogComponent = (props: DialogComponentProps) => {
    const [open, setOpen] = useState(false);
    <Dialog
        open={open}
        onClose={() => {
            props.onDismiss();
            return setOpen(false)
        }}
        className="dialog"
    >
        <DialogHeading className="heading">
            Success
        </DialogHeading>
        {props.children}
        <div>
            <DialogDismiss className="button">OK</DialogDismiss>
        </div>
    </Dialog>
};

export default DialogComponent;
