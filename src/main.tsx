import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from '@aws-amplify/ui-react';
import Screens from "./components/Screens.tsx";
import "./index.css";
import 'node_modules/modern-normalize/modern-normalize.css';
import { Amplify } from "aws-amplify";
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from "../amplify_outputs.json";

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
    ...amplifyConfig,
    Predictions: outputs.custom.Predictions,
});

import * as process from 'process';
window.process = process;

import { Buffer } from 'buffer';
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Authenticator>
            <Screens />
        </Authenticator>
    </React.StrictMode>
);
