import React, { useState } from 'react';

import { Box, Heading, Text, useViewMetadata, useRecords } from '@airtable/blocks/ui';

import { CludoClient } from "@cludo/cludo-api-client";
import { recordListConverter } from '../helperFunctions/typeParser'
import { Table, View, Cursor } from '@airtable/blocks/models';
import GlobalConfig from '@airtable/blocks/dist/types/src/global_config';
import { removeValidandId } from '../helperFunctions/filterFunctions';

//Custom components
import Form from './Form';

export interface SynchronizerProps {
    table: Table,
    view: View,
    globalConfig: GlobalConfig,
    cursor: Cursor
}

function Synchronizer ({table, view, globalConfig, cursor}: SynchronizerProps) {
    //Local State
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(false);

    //Airtable Hooks
    const viewMetadata = useViewMetadata(view);
    const records = useRecords(table);

    const customerId: any = globalConfig.get('customerId');
    const apiKey : any  = globalConfig.get('apiKey');
    const crawlerId: any  = globalConfig.get('crawlerId');
  
  const indexDoc = async () => {
        if (!customerId) {
            setMessage("Customer Id is not set")
            return
        }
        if (!apiKey) {
            setMessage("API key is not set")
            return
        }
        if (!crawlerId) {
            setMessage("Crawler Id is not set")
            return
        }

        const searchClient = new CludoClient({
            customerId: customerId,
            engineId: 111111,
            apiKey: apiKey,
        });

        const selectedRecords = records.filter(record =>  cursor.selectedRecordIds.includes(record.id))
        if (selectedRecords.length==0) {
            setMessage("Please select some records from the table before syncing.")
            return
        }
        const cludoRecordList = recordListConverter(selectedRecords, viewMetadata.visibleFields)
        const validRecords = cludoRecordList.filter(record => record.valid)
                                            .map(rec => removeValidandId(rec));

        if (validRecords.length==0) {
            setMessage("The selected records are not valid. Please check that Url, Description and Title fields are filled and in an appropiate format ('URL' for Url and 'Long text'/'Single Line text' for Title and Description")
            return
        }
        
        setLoader(true);
        const pushResponse = await searchClient.content.indexDocument(crawlerId, validRecords[0]);
        setLoader(false)
        if(pushResponse.success){
            setMessage(validRecords.length + " rows have been pushed. \n\n" + (cludoRecordList.length - validRecords.length) + " records were ignored.")
        } else {
            setMessage("An message ocurred. message code: " + pushResponse.error.code + ". This was the message: " + pushResponse.error.messages.toString())
        }
    }

    const handleOnChange = (event) => {
        globalConfig.setAsync(event.target.name, event.target.value);
    }

  return (
      <Box>
          <Box padding={3} borderBottom="thick">
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
          <Form 
            customerId={customerId}
            apiKey={apiKey}
            crawlerId={crawlerId}
            indexDoc={indexDoc}
            message={message}
            handleOnChange={handleOnChange}
            loader={loader}>
           </Form>
      </Box>
  );
}

export default Synchronizer;