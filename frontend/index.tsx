import React, { useState } from 'react';

//Airtable Blocks
import { initializeBlock, useSettingsButton } from '@airtable/blocks/ui';

//Custom components
import CludoCrawlerExtension from './CludoCrawlerExtension';
import SettingsForm from './components/SettingsForm/SettingsForm';

/**
 * Main component to be injected into the Airtable Extensions context.
 * @returns a Synchronizer if users has selected view or table.
 * @remarks This component uses Airtable Blocks hooks such as useBase, useGlobalConfig, useCursor, 
 * useWatchable, useLoadable to keep track of the users' interactions with Airtable UI.
 */
function App() {
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  //Use Settings Hook
  useSettingsButton(() => setIsShowingSettings(!isShowingSettings));

  if (isShowingSettings) {
    return <SettingsForm setIsShowingSettings={setIsShowingSettings}/>
  }
  return <CludoCrawlerExtension />
}

initializeBlock(() => <App />);