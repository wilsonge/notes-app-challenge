import React from 'react';
import ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import Screens from './components/Screens.tsx';

import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from 'aws-amplify/utils';
import outputs from "../amplify_outputs.json";

import '@aws-amplify/ui-react/styles.css';
import "./index.css";

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
        <div className="container mx-auto">
            <Authenticator>
                <Screens />
            </Authenticator>
        </div>
    </React.StrictMode>
);
