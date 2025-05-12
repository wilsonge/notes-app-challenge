import { MouseEventHandler, useState } from "react";
import styled from "@emotion/styled";
import { FaRegEdit, FaPlay, FaRegTrashAlt } from "react-icons/fa";
import { Predictions } from '@aws-amplify/predictions';
import { Icon } from '@aws-amplify/ui-react';

import RecordingEditor from "./Recording-Editor";
import { INoteEditableData } from "../types.ts";

const Note = styled("div")`
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(116, 180, 155, 0.2);
`;

const Title = styled("h2")`
  color: #74b49b;
  margin-top: 0;
  margin-bottom: 8px;
`;

const Text = styled("p")`
  color: #74b49b;
  margin-top: 0;
`;

const ButtonIcon = styled("button")`
  padding: 8px 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #74b49b;
  border: none;
  cursor: pointer;
  flex: 1;
  background-color: #ffffff;

  &:hover {
    color: #ffffff;
    background-color: #74b49b;
  }
`;

const Divider = styled("div")`
  height: 2px;
  background-color: #f4f9f4;
`;

const NoteActions = styled("div")`
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  height: 50px;
  background-color: #74b49b;
`;

const Info = styled.div`
  padding: 24px;
`;


interface NoteComponentProps extends INoteEditableData {
    onDelete: MouseEventHandler<SVGElement> | undefined;
    onSaveChanges: (values: INoteEditableData) => Promise<void>;
}

const NoteComponent = (props: NoteComponentProps) => {
    const [showEditor, setShowEditor] = useState(false);

    const playAudio = async () => {
        const result = await Predictions.convert({
            textToSpeech: {
                source: {
                    text: props.text
                }
            }
        });

        const audioCtx = new AudioContext();
        const source = audioCtx.createBufferSource();

        await audioCtx.decodeAudioData(
            result.audioStream,
            buffer => {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.start(0);
            },
            error => console.log(error)
        );
    };

    return (
        <Note>
            <Info>
                <Title>{props.title}</Title>
                <Text>{props.text}</Text>
            </Info>
            <Divider />
            <NoteActions>
                <ButtonIcon onClick={() => playAudio()}>
                    <Icon viewBox={{width: 448, height: 512 }} as={FaPlay} />
                </ButtonIcon>
                <ButtonIcon onClick={() => setShowEditor(true)}>
                    <Icon viewBox={{width: 576, height: 512 }} as={FaRegEdit} />
                </ButtonIcon>
                <ButtonIcon>
                    <Icon viewBox={{width: 448, height: 512 }} as={FaRegTrashAlt} onClick={props.onDelete} />
                </ButtonIcon>
            </NoteActions>

            <RecordingEditor
                dialogOpen={showEditor}
                title={props.title}
                text={props.text}
                onDismiss={() => {
                    setShowEditor(false);
                }}
                onSave={props.onSaveChanges}
            />
        </Note>
    );
};

export default NoteComponent;
