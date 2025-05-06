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

const StyledTabList = styled(TabList)`
  display: flex;
  justify-content: stretch;
  align-items: center;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  height: 40px;
  box-shadow: 0 6px 6px rgba(116, 180, 155, 0.4);

  & > [data-selected] {
    border-bottom-color: #74b49b;
    color: #74b49b;
  }
`;

const StyledTabPanels = styled.div`
  padding-top: 50px;
  flex: 1;

  [hidden] {
    display: none;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  flex: 1;
  padding: 16px;
  display: flex;
  min-height: calc(100% - 32px);
`;

const StyledTab = styled(Tab)`
  text-transform: uppercase;
  flex: 1;
  padding: 16px;
  color: #74b49b;
  background-color: #ffffff;
  font-size: 16px;
  border: none;
  border-bottom: 3px solid #ffffff;
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
                <StyledTabList store={tab}>
                    <StyledTab id={defaultSelectedId}>Notes</StyledTab>
                    <StyledTab>Record</StyledTab>
                </StyledTabList>
                <StyledTabPanels>
                    <StyledTabPanel tabId={defaultSelectedId}>
                        <Notes />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <Record />
                    </StyledTabPanel>
                </StyledTabPanels>
            </TabProvider>
        </>
    );
};

export default Screens;
