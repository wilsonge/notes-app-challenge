import {FC, useState} from "react";
import { Predictions } from '@aws-amplify/predictions';
import {
    FaMicrophone,
    FaMicrophoneAlt,
    FaMicrophoneAltSlash
} from "react-icons/fa";
import MicrophoneStream from "microphone-stream";

import RecordingEditor from "./Recording-Editor";
import { client } from "../client.ts";
import { Icon } from "@aws-amplify/ui-react";
import { INoteEditableData } from "../types.ts"

// Define type for the audio buffer utility
interface AudioBufferUtil {
    reset: () => void;
    addData: (raw: Float32Array) => void;
    getData: () => Float32Array;
}

const RecordComponent: FC = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [showRecordingEditor, setShowRecordingEditor] = useState<boolean>(false);
    const [recordingText, setRecordingText] = useState<string>("");
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [micStream, setMicStream] = useState<MicrophoneStream | null>(null);
    const [audioBuffer] = useState<AudioBufferUtil>(
        (function(): AudioBufferUtil {
            let buffer: number[] = [];
            let totalSamples = 0;

            return {
                reset: function(): void {
                    console.debug('resetting buffer');
                    buffer = [];
                    totalSamples = 0;
                },
                addData: function(chunk: Float32Array): void {
                    buffer = buffer.concat(...chunk);
                    totalSamples += chunk.length;
                },
                getData: function(): Float32Array {
                    return new Float32Array(buffer)
                },
            };
        })()
    );

    const startRecording = async (): Promise<void> => {
        try {
            const stream = await window.navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            });

            const micStreamObj = new MicrophoneStream();
            micStreamObj.setStream(stream);

            micStreamObj.on('data', (chunk: Buffer): void => {
                if (!chunk) return;
                audioBuffer.addData(MicrophoneStream.toRaw(chunk));
            });

            setMicStream(micStreamObj);
            setIsRecording(true);
        } catch (error: unknown) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = async (): Promise<void> => {
        // If we have no mic stream nothing to stop. So we can safely abort.
        if (micStream == null) {
            return;
        }

        micStream.stop();
        setIsRecording(false);
        setIsConverting(true);

        const bufferList = audioBuffer.getData();

        if (bufferList.length === 0) {
            console.warn("No audio data collected");
            return;
        }

        try {
            const result = await Predictions.convert({
                transcription: {
                    source: {
                        bytes: bufferList,
                    },
                    language: 'en-GB',
                }
            });

            setRecordingText(result.transcription.fullText);
            console.log(result.transcription.fullText);
        } catch (error: unknown) {
            console.error('Error transcribing recording:', error);
        }

        setMicStream(null);
        audioBuffer.reset();
        setShowRecordingEditor(true);
        setIsConverting(false);
    };

    return (
        <div className="flex flex-col items-center justify-around my-auto mx-4">
            <div className="relative justify-center items-center w-[120px] h-[120px]">
                <div className={'absolute bg-v1-teal w-[100%] h-[100%] top-0 left-0 rounded-[50%] ' + (isRecording || isConverting) ? 'animate-modern-pulse' : ''} />
                <div
                    className="bg-v1-teal flex absolute cursor-pointer top-0 left-0 w-[100%] h-[100%] rounded-[50%]"
                    onClick={async() => {
                        if (!isRecording) {
                            await startRecording();
                        } else {
                            await stopRecording();
                        }
                    }}
                >
                    {isConverting ? (
                        <Icon viewBox={{width: 640, height: 512 }} as={FaMicrophoneAltSlash}
                              size={50} style={{ margin: "auto" }} />
                    ) : isRecording ? (
                        <Icon viewBox={{width: 352, height: 512 }} as={FaMicrophone}
                              size={50} style={{ margin: "auto" }} />
                    ) : (
                        <Icon viewBox={{width: 352, height: 512 }} as={FaMicrophoneAlt}
                              size={50} style={{ margin: "auto" }} />
                    )}
                </div>
            </div>
            <RecordingEditor
                dialogOpen={showRecordingEditor}
                text={recordingText}
                onDismiss={() => {
                    setShowRecordingEditor(false);
                }}
                onSave={async (data: INoteEditableData) => {
                    try {
                        const { data: summary, errors: ai_errors } = await client.generations
                            .summarize({text: data.text})

                        if (ai_errors) {
                            console.error("Error creating note:", ai_errors);
                            return;
                        }

                        if (!summary) {
                            console.error('Failed to find a summary');
                            return;
                        }

                        const fullNoteData = {
                            ...data,
                            'createdAt': Date.now().toString(),
                            'updatedAt': Date.now().toString(),
                            summary,
                        }
                        const { data: returnedData, errors } = await client.models.Note.create(fullNoteData);
                        if (errors) {
                            console.error("Error creating note:", errors);
                        }
                        console.debug(returnedData);
                        document.getElementById('notes-tab')?.click();
                    } catch (error) {
                        console.error("Error saving note:", error);
                    }
                }}
            />
        </div>
    );
};

export default RecordComponent;
