import { Dialog, DialogOverlay, DialogContent } from "@ariakit/react";
import styled from "@emotion/styled";

const StyledDialogOverlay = styled(DialogOverlay)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: hsla(120, 29%, 97%, 0.95);
  padding: 24px;
  z-index: 99;
`;

const StyledDialogContent = styled(DialogContent)`
  background-color: #ffffff;
  border-radius: 4px;
  max-width: 800px;
  box-shadow: 0 0 9px rgba(255, 255, 255, 0.3);
  padding: 24px;
  margin: 24px auto;
`;

const DialogComponent = props => (
    <Dialog aria-label="Popup">
        <StyledDialogOverlay>
            <StyledDialogContent aria-label="Dialog">{props.children}</StyledDialogContent>
        </StyledDialogOverlay>
    </Dialog>
);

export default DialogComponent;
