import React, { useState } from 'react';

//Airtable Blocks
import { initializeBlock, useSettingsButton } from '@airtable/blocks/ui';

//Custom components
import CludoCrawlerExtension from './CludoCrawlerExtension';
import SettingsForm from './components/SettingsForm';

/**
 * Main component to be injected into the Airtable Extensions context.
 * @returns a Synchronizer if users has selected view or table.
 * @remarks This component uses Airtable Blocks hooks such as useBase, useGlobalConfig, useCursor, 
 * useWatchable, useLoadable to keep track of the users' interactions with Airtable UI.
 */
function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  useSettingsButton(() => setIsSettingsOpen(!isSettingsOpen));

  if (isSettingsOpen) {
    return <SettingsForm setIsSettingsOpen={setIsSettingsOpen}/>
  }
  return <CludoCrawlerExtension />
}

initializeBlock(() => <App />);