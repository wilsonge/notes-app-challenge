import styled from "@emotion/styled";
import { Button } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import { TabProvider, TabList, Tab, TabPanel, useTabStore } from "@ariakit/react";

import Notes from "./Notes";
import Record from "./Record";

const Header = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled("h1")`
  margin-top: 0;
  margin-bottom: 0;
  text-transform: uppercase;
  color: var(--text-v1-teal);
`;

const SignOutButton = styled(Button)`
  background-color: var(--bg-v1-teal);
  cursor: pointer;
`;

const Screens = () => {
    const tab = useTabStore();
    const defaultSelectedId = "default-selected-tab";

    async function handleSignOut() {
        await signOut()
    }

    return (
        <>
            <Header>
                <Title>Quick Notes</Title>
                <SignOutButton
                    onClick={handleSignOut}>
                    Sign Out
                </SignOutButton>
            </Header>
            <TabProvider defaultSelectedId={defaultSelectedId}>
                <TabList className="tab-list" store={tab}>
                    <Tab className="tab" id={defaultSelectedId}>Notes</Tab>
                    <Tab className="tab">Record</Tab>
                </TabList>
                <div className="panels">
                    <TabPanel store={tab} tabId={defaultSelectedId}>
                        <Notes />
                    </TabPanel>
                    <TabPanel store={tab}>
                        <Record />
                    </TabPanel>
                </div>
            </TabProvider>
        </>
    );
};

export default Screens;
