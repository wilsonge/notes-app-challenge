import { MouseEventHandler, useState, FC } from "react";
import { FaRegEdit, FaPlay, FaRegTrashAlt } from "react-icons/fa";
import { Predictions } from '@aws-amplify/predictions';
import { Icon } from '@aws-amplify/ui-react';
import { Heading, HeadingLevel } from '@ariakit/react';

import RecordingEditor from "./Recording-Editor";
import { INoteEditableData, INoteData } from "../types.ts";

interface NoteComponentProps extends INoteData {
    onDelete: MouseEventHandler<SVGElement> | undefined;
    onSaveChanges: (values: INoteEditableData) => Promise<void>;
}

const NoteComponent: FC<NoteComponentProps> = (props: NoteComponentProps) => {
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
        <HeadingLevel>
            <div className="background-white mb-6 flex flex-col justify-space-between align-items-stretch overflow-hidden rounded-sm shadow-sm tw-shadow-color-v1-teal">
                <div className="p-6">
                    <Heading className="text-v1-teal mt-0 mb-2 text-xl">{props.title}</Heading>
                    <p className="text-v1-midnight mt-0">Summary: {props.summary}</p>
                    <p className="text-v1-midnight mt-0">Note: {props.text}</p>
                </div>
                <div className="h-[2px] background-v1-putty" />
                <div className="flex justify-stretch align-items-stretch h-[50px] background-v1-teal border-gray-100 border-solid border-t-[1px]">
                    <button className="inline-flex justify-center items-center text-v1-teal bg-white hover:bg-v1-teal hover:text-white border-0 flex-1 py-2 px-2.5" onClick={() => playAudio()}>
                        <Icon viewBox={{width: 448, height: 512 }} as={FaPlay} />
                    </button>
                    <button className="inline-flex justify-center items-center text-v1-teal bg-white hover:bg-v1-teal hover:text-white border-0 flex-1 py-2 px-2.5" onClick={() => setShowEditor(true)}>
                        <Icon viewBox={{width: 576, height: 512 }} as={FaRegEdit} />
                    </button>
                    <button className="inline-flex justify-center items-center text-v1-teal bg-white hover:bg-v1-teal hover:text-white border-0 flex-1 py-2 px-2.5">
                        <Icon viewBox={{width: 448, height: 512 }} as={FaRegTrashAlt} onClick={props.onDelete} />
                    </button>
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
        </HeadingLevel>
    );
};

export default NoteComponent;
