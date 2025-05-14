import { MouseEventHandler, useState } from "react";
import styled from "@emotion/styled";
import { FaRegEdit, FaPlay, FaRegTrashAlt } from "react-icons/fa";
import { Predictions } from '@aws-amplify/predictions';
import { Icon } from '@aws-amplify/ui-react';

import RecordingEditor from "./Recording-Editor";
import { INoteEditableData } from "../types.ts";

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
        <div className="background-white mb-6 flex flex-col justify-space-between align-items-stretch overflow-hidden rounded-sm shadow-sm tw-shadow-color-v1-teal">
            <div className="p-6">
                <h2 className="text-v1-teal mt-0 mb-2">{props.title}</h2>
                <p className="text-v1-teal mt-0">{props.text}</p>
            </div>
            <div className="h-[2px] background-v1-putty" />
            <div className="flex justify-stretch align-items-stretch h-[50px] background-v1-teal">
                <ButtonIcon onClick={() => playAudio()}>
                    <Icon viewBox={{width: 448, height: 512 }} as={FaPlay} />
                </ButtonIcon>
                <ButtonIcon onClick={() => setShowEditor(true)}>
                    <Icon viewBox={{width: 576, height: 512 }} as={FaRegEdit} />
                </ButtonIcon>
                <ButtonIcon>
                    <Icon viewBox={{width: 448, height: 512 }} as={FaRegTrashAlt} onClick={props.onDelete} />
                </ButtonIcon>
            </div>

            <RecordingEditor
                dialogOpen={showEditor}
                title={props.title}
                text={props.text}
                onDismiss={() => {
                    setShowEditor(false);
                }}
                onSave={props.onSaveChanges}
            />
        </div>
    );
};

export default NoteComponent;
