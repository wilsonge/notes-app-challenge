import { Dialog, DialogHeading, DialogDismiss } from "@ariakit/react";
import { PropsWithChildren } from "react"

interface DialogComponentProps extends PropsWithChildren<{}> {
    onDismiss: () => void;
    open: boolean;
}

const DialogComponent = (props: DialogComponentProps) => {
    return (
        <Dialog
            open={props.open}
            onClose={() => props.onDismiss()}
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
    )
};

export default DialogComponent;
