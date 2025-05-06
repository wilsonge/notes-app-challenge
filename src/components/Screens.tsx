import styled from "@emotion/styled";
import { Button } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import { TabProvider, TabList, Tab, TabPanel, useTabStore } from "@ariakit/react";

import Notes from "./Notes";
import Record from "./Record";

const Header = styled("div")`
  background-color: #ffffff;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  right: 0;
  left: 0;
  height: 80px;
  z-index: 2;
`;

const Title = styled("h1")`
  margin-top: 0;
  margin-bottom: 0;
  text-transform: uppercase;
  color: #74b49b;
  font-size: 24px;
`;

const SignOutButton = styled(Button)`
  background-color: #74b49b;
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
                <TabList store={tab}>
                    <Tab id={defaultSelectedId}>Notes</Tab>
                    <Tab>Record</Tab>
                </TabList>
                <div className="panels">
                    <TabPanel tabId={defaultSelectedId}>
                        <Notes />
                    </TabPanel>
                    <TabPanel>
                        <Record />
                    </TabPanel>
                </div>
            </TabProvider>
        </>
    );
};

export default Screens;
