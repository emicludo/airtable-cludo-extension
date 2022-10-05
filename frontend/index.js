import {
  Box,
  Heading,
  initializeBlock,
  Text,
  useBase,
  useViewMetadata,
  useWatchable,
  useRecords,
  Button,
  useGlobalConfig,
  FormField, 
  Input,
  useCursor,
  useLoadable
} from '@airtable/blocks/ui';
/* import { cursor } from '@airtable/blocks'; */
import { CludoClient } from "@cludo/cludo-api-client";
import { recordListConverter } from './helperFunctions/typeParser'
import { isRecordSelected } from './helperFunctions/filterFunctions'

import React, { useState } from 'react';

function CludoCrawlerExtension() {
  const base = useBase();
  const globalConfig = useGlobalConfig();
  const cursor = useCursor();
  // useWatchable is used to re-render the app whenever the active table or view changes.
  useWatchable(cursor, ['activeTableId', 'activeViewId', 'selectedFieldIds']);
  // load selected records and fields
  useLoadable(cursor);

  const table = base.getTableByIdIfExists(cursor.activeTableId);
  const view = table && table.getViewByIdIfExists(cursor.activeViewId);

  if (table && view) {
      return <Synchronizer base={base} table={table} view={view} globalConfig={globalConfig} cursor={cursor}/>;
  } else {
      // Still loading table and/or view.
      return null;
  }
}

const indexDoc = async (records, visibleFields,globalConfig, setError, cursor) => {
    let customerId = globalConfig.get('customerId');
    let apiKey = globalConfig.get('apiKey');
    let crawlerId = globalConfig.get('crawlerId');
    if (!customerId) {
        setError("Customer Id is not set")
        return
    }
    if (!apiKey) {
        setError("API key is not set")
        return
    }
    if (!crawlerId) {
        setError("Crawler Id is not set")
        return
    }

    const searchClient = new CludoClient({
        customerId: customerId,
        engineId: 111111,
        apiKey: apiKey,
    });

    const selectedRecords = records.filter(record => isRecordSelected(record.id, cursor.selectedRecordIds))
    if (selectedRecords.length==0) {
        setError("Please select some records from the table before syncing.")
        return
    }
    const cludoRecordList = recordListConverter(selectedRecords, visibleFields)
    const validRecords = cludoRecordList.filter(record => record.valid)
                                        .map(function(rec) { 
                                            delete rec.valid; 
                                            delete rec.id; 
                                            return rec; 
                                        });
    
    if (validRecords.length==0) {
        setError("The selected records are not valid. Please check that Url, Description and Title fields are filled and in an appropiate format ('URL' for Url and 'Long text'/'Single Line text' for Title and Description")
        return
    }
    setError("Pushing data to Index. Please wait")
    const pushResponse = await searchClient.content.indexDocument(crawlerId, validRecords[0]);
    if(pushResponse.success){
        setError(validRecords.length + " rows have been pushed. \n\n" + (cludoRecordList.length - validRecords.length) + " records were ignored.")
    } else {
        setError("An error ocurred. Error code: " + pushResponse.error.code + ". This was the message: " + pushResponse.error.messages.toString())
    }
}

function Synchronizer ({table, view, globalConfig, cursor}) {
  const viewMetadata = useViewMetadata(view);
  const records = useRecords(table);

  const [error, setError] = useState('');

  return (
      <Box>
          <Box padding={2} borderBottom="thick">
              <Heading size="small" margin={0}>
                  {table.name} / {view.name}
              </Heading>
              {/* Show the table description only if it exists */}
              {table.description && (
                  <Text textColor="light" style={{whiteSpace: 'pre'}}>
                      {table.description}
                  </Text>
              )}
          </Box>
          <Box margin={3}>
            <FormField label="Customer Id">
                <Input name="customerId" value={globalConfig.get('customerId') || ""} onChange={e => globalConfig.setAsync('customerId', e.target.value)} />
            </FormField>
            <FormField label="Api Key">
                <Input name="apiKey" value={globalConfig.get('apiKey') || ""} onChange={e => globalConfig.setAsync('apiKey', e.target.value)} />
            </FormField>
            <FormField label="Crawler Id">
                <Input name="crawlerId" value={globalConfig.get('crawlerId') || ""} onChange={e => globalConfig.setAsync('crawlerId', e.target.value)} />
            </FormField>

            <Button onClick={()=> indexDoc(records, viewMetadata.visibleFields,globalConfig, setError, cursor)}>
                Sync!
            </Button>
            {
                error ? <div>{error}</div> : null
            }
          </Box>
      </Box>
  );
}

initializeBlock(() => <CludoCrawlerExtension />);