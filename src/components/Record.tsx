import { useState } from "react";
import { Predictions } from '@aws-amplify/predictions';
import { keyframes, css } from "@emotion/core";
import styled from "@emotion/styled";
import {
    FaMicrophone,
    FaMicrophoneAlt,
    FaMicrophoneAltSlash
} from "react-icons/fa";
import mic from "microphone-stream";

import RecordingEditor from "./Recording-Editor";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import MicrophoneStream from "microphone-stream";

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

const RecordComponent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [showRecordingEditor, setShowRecordingEditor] = useState(false);
    const [recordingText, setRecordingText] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const [micStream, setMicStream] = useState<MicrophoneStream|null>();
    const [audioBuffer] = useState(
        (function() {
            let buffer: Array<any> = [];
            function add(raw: Float32Array) {
                buffer = buffer.concat(...raw);
                return buffer;
            }
            function newBuffer() {
                console.log("resetting buffer");
                buffer = [];
            }

            return {
                reset: function() {
                    newBuffer();
                },
                addData: function(raw: Float32Array) {
                    return add(raw);
                },
                getData: function() {
                    return buffer;
                }
            };
        })()
    );

    const startRecording = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        });
        const startMic = new MicrophoneStream();

        startMic.setStream(stream);
        startMic.on('data', (chunk: Buffer) => {
            var raw = mic.toRaw(chunk);
            if (raw == null) {
                return;
            }
            audioBuffer.addData(raw);
        });

        setMicStream(startMic);
        setIsRecording(true);
    };

    const stopRecording = async () => {
        // TODO: better error handling
        if (micStream == null) { return; }
        micStream.stop();
        setIsRecording(false);
        setIsConverting(true);

        // @ts-ignore
        const buffer: Buffer = audioBuffer.getData();
        const result = await Predictions.convert({
            transcription: {
                source: {
                    bytes: buffer
                }
            }
        });

        setMicStream(null);
        audioBuffer.reset();
        setRecordingText(result.transcription.fullText);
        setIsConverting(false);
        setShowRecordingEditor(true);
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
                    onSave={async data => {
                        // TODO: We probably do wanna use this!
                        // @ts-ignore
                        const { errors, data: newNote } = await client.models.Note.create(data)
                        // TODO: This would reset the screen tab back from "Record" to "Notes". Currently no longer  works
                        //       with the migration to the new Tabs UI
                        // props.setTabIndex(0);
                    }}
                />
            )}
        </Container>
    );
};

export default RecordComponent;
