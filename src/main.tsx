import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from '@aws-amplify/ui-react';
import Screens from "./components/Screens.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Authenticator>
            <Screens />
        </Authenticator>
    </React.StrictMode>
);
