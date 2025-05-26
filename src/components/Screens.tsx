import { Button } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import { FC } from 'react';
import { TabProvider, TabList, Tab, TabPanel, useTabStore } from '@ariakit/react';
import { Heading, HeadingLevel } from '@ariakit/react';

import Notes from "./Notes";
import Record from "./Record";

const Screens: FC = () => {
    const tab = useTabStore();
    const defaultSelectedId = "default-selected-tab";

    async function handleSignOut() {
        await signOut()
    }

    return (
        <>
            <HeadingLevel>
                <div className="flex items-center justify-between">
                    <Heading className="text-v1-teal uppercase mb-0 mt-0 text-4xl">Quick Notes</Heading>
                    <Button className="bg-v1-teal"
                        onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </div>
                <TabProvider defaultSelectedId={defaultSelectedId}>
                    <TabList className="flex gap-2" store={tab}>
                        <Tab className="tab" id={defaultSelectedId}>Notes</Tab>
                        <Tab className="tab">Record</Tab>
                    </TabList>
                    <div className="p-2">
                        <TabPanel store={tab} tabId={defaultSelectedId}>
                            <Notes />
                        </TabPanel>
                        <TabPanel store={tab}>
                            <Record />
                        </TabPanel>
                    </div>
                </TabProvider>
            </HeadingLevel>
        </>
    );
};

export default Screens;
