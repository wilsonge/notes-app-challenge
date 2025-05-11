import { useState } from "react";
import { Predictions } from '@aws-amplify/predictions';
import { keyframes, css } from "@emotion/core";
import styled from "@emotion/styled";
import {
    FaMicrophone,
    FaMicrophoneAlt,
    FaMicrophoneAltSlash
} from "react-icons/fa";
import MicrophoneStream from "microphone-stream";

import RecordingEditor from "./Recording-Editor";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const Container = styled("div")`
  margin: 16px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const pulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.3;
    }

    100% {
        transform: scale(2);
        opacity: 0;
    }
`;

// Define type for the audio buffer utility
interface AudioBufferUtil {
    reset: () => void;
    addData: (raw: Buffer) => void;
    getData: () => Buffer<ArrayBufferLike>;
}

interface NoteData {
    title: string;
    text: string;
}

const RecordComponent = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [showRecordingEditor, setShowRecordingEditor] = useState<boolean>(false);
    const [recordingText, setRecordingText] = useState<string>("");
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [micStream, setMicStream] = useState<MicrophoneStream | null>(null);
    const [audioBuffer] = useState<AudioBufferUtil>(
        (function(): AudioBufferUtil {
            let buffer: Buffer<ArrayBufferLike>[] = [];

            return {
                reset: function(): void {
                    console.log("resetting buffer");
                    buffer = [];
                },
                addData: function(chunk: Buffer<ArrayBufferLike>): void {
                    buffer.push(chunk);
                },
                // @ts-ignore
                getData: function(): Buffer<ArrayBufferLike>[] {
                    return buffer
                }
            };
        })()
    );

    const startRecording = async (): Promise<void> => {
        try {
            const stream = await window.navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            });

            const startMic = new MicrophoneStream();
            startMic.setStream(stream);

            startMic.on('data', (chunk: Buffer) => {
                audioBuffer.addData(chunk);
            });

            setMicStream(startMic);
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = async (): Promise<void> => {
        if (micStream == null) {
            return;
        }

        micStream.stop();
        setIsRecording(false);
        setIsConverting(true);

        const buffer = audioBuffer.getData();
        console.log(buffer);

        try {
            // @ts-ignore
            const result = await Predictions.convert({
                transcription: {
                    source: {
                        bytes: buffer
                    }
                }
            });

            if (result.transcription?.fullText) {
                setRecordingText(result.transcription.fullText);
            }
        }
        catch (e: unknown) {
            let message = 'Unknown Error'
            if (e instanceof Error) message = e.message

            console.error(e);
            console.log(message);
        }

        setMicStream(null);
        audioBuffer.reset();
        setShowRecordingEditor(true);
        setIsConverting(false);
    };

    return (
        <Container>
            <div
                css={css`
                    position: relative;
                    justify-content: center;
                    align-items: center;
                    width: 120px;
                    height: 120px;
                `}
            >
                <div
                    css={[
                        css`
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            position: absolute;
                            border-radius: 50%;
                            background-color: #74b49b;
                        `,
                        isRecording || isConverting
                            ? css`
                                animation: ${pulse} 1.5s ease infinite;
                            `
                            : {}
                    ]}
                />
                <div
                    css={css`
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        position: absolute;
                        border-radius: 50%;
                        background-color: #74b49b;
                        display: flex;
                        cursor: pointer;
                    `}
                    onClick={() => {
                        if (!isRecording) {
                            startRecording();
                        } else {
                            stopRecording();
                        }
                    }}
                >
                    {isConverting ? (
                        <FaMicrophoneAltSlash
                            size={50}
                            style={{ margin: "auto" }}
                        />
                    ) : isRecording ? (
                        <FaMicrophone
                            size={50}
                            style={{ margin: "auto" }}
                        />
                    ) : (
                        <FaMicrophoneAlt
                            size={50}
                            style={{ margin: "auto" }}
                        />
                    )}
                </div>
            </div>
            {showRecordingEditor && (
                <RecordingEditor
                    text={recordingText}
                    onDismiss={() => {
                        setShowRecordingEditor(false);
                    }}
                    onSave={async (data: NoteData) => {
                        try {
                            // @ts-ignore
                            const { errors, data: NoteData } = await client.models.Note.create(data);
                            if (errors) {
                                console.error("Error creating note:", errors);
                            }
                            // TODO: This would reset the screen tab back from "Record" to "Notes". Currently no longer works
                            // with the migration to the new Tabs UI
                            // props.setTabIndex(0);
                        } catch (error) {
                            console.error("Error saving note:", error);
                        }
                    }}
                />
            )}
        </Container>
    );
};

export default RecordComponent;
