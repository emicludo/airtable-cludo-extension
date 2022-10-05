import React from 'react';

//Airtable Blocks
import { initializeBlock, useBase, useWatchable, useGlobalConfig, useCursor, useLoadable } from '@airtable/blocks/ui';

//Custom components
import Synchronizer from './components/Synchronizer';

/**
    Main component to be injected into the Airtable Extensions context.
    @returns a Synchronizer if users has selected view or table, or null.
    @remarks This component uses Airtable Blocks hooks such as useBase, useGlobalConfig, useCursor, 
    useWatchable, useLoadable to keep track of the users' interactions with Airtable UI.
 */
function CludoCrawlerExtension() {
  const base = useBase();
  const globalConfig = useGlobalConfig();
  const cursor = useCursor();
  // useWatchable is used to re-render the app whenever the active table, view, or selected fields change.
  useWatchable(cursor, ['activeTableId', 'activeViewId', 'selectedFieldIds']);
  // load selected records and fields
  useLoadable(cursor);

  const table = cursor.activeTableId ? base.getTableByIdIfExists(cursor.activeTableId) : null;
  const view = cursor.activeViewId && table ? table.getViewByIdIfExists(cursor.activeViewId) : null;

  if (table && view) {
      return <Synchronizer table={table} view={view} globalConfig={globalConfig} cursor={cursor}/>;
  } else {
      // Still loading table and/or view.
      return null;
  }
}

initializeBlock(() => <CludoCrawlerExtension />);