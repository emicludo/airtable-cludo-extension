import React, { useState } from 'react';

import './Synchronizer.css';

//Airtable Blocks
import { Box, Heading, Text, useRecords, Button, Loader } from '@airtable/blocks/ui';
import { Table, View, Cursor, Field } from '@airtable/blocks/models';
import GlobalConfig from '@airtable/blocks/dist/types/src/global_config';

//Cludo API Client
import { CludoClient } from "@cludo/cludo-api-client";

//Helper Functions
import { recordListConverter } from '../../helperFunctions/typeParser'
import { removeValidandId } from '../../helperFunctions/filterFunctions';
import { parallelIndexDoc } from '../../helperFunctions/indexer'

//Custom components
import FieldList from '../FieldList/FieldList';

export interface SynchronizerProps {
    table: Table,
    view: View,
    globalConfig: GlobalConfig,
    cursor: Cursor
}

function Synchronizer ({table, view, globalConfig, cursor}: SynchronizerProps) {
  //Local State
  const [message, setMessage] = useState<string[]>([]);
  const [loader, setLoader] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);

  //Airtable Hooks
  const records = useRecords(table);
  //Retrieve values from GlobalConfig (set in Airtable Settings)
  const  customerId: unknown = globalConfig.get('customerId')
  const  apiKey: unknown = globalConfig.get('apiKey')
  const  crawlerId: unknown = globalConfig.get('crawlerId')

  //Types assertion
  const customerIdN = customerId as number
  const apiKeyS = apiKey as string
  const crawlerIdN = crawlerId as number

  /**
   * Indexes all rows selected by the user that pass the validations
   * @returns {Promise<void>}
   */
  const indexDoc = async (): Promise<void> => {
    setMessage([])
    //Pre-validations
    if (!customerIdN) {
      setMessage(["Customer Id is not set"])
      return
    }
    if (!apiKeyS) {
      setMessage(["API key is not set"])
      return
    }
    if (!crawlerIdN) {
      setMessage(["Crawler Id is not set"])
      return
    }
    //Instantiates new Cludo object, Engine??
    const searchClient = new CludoClient({
      customerId: customerIdN,
      engineId: 111111,
      apiKey: apiKeyS,
    });

    //Filters by selected rows
    const selectedRecords = records.filter(record =>  cursor.selectedRecordIds.includes(record.id))
    if (selectedRecords.length==0) {
      setMessage(["Please select some records from the table before syncing."])
      return
    }
    
    //Converts list from Airtable format to CludoIndexElement[]
    const cludoRecordList = recordListConverter(selectedRecords, selectedFields)

    //Filters only valid records (with Title, URL and Description fields)
    const validRecords = cludoRecordList.filter(record => record.valid)
                                        .map(rec => removeValidandId(rec));
    if (validRecords.length==0) {
      setMessage(["The selected records are not valid. Please check that Url, Description and Title fields are filled and in an appropiate format ('URL' for Url and 'Long text'/'Single Line text' for Title and Description"])
      return
    }
    
    setLoader(true);
    const response = await parallelIndexDoc(validRecords, searchClient, crawlerIdN);

    //Prepares Feedback response message
    const newMessage: string[] = []
    newMessage.push(response.totalPushed + " rows have been pushed.")

    if ((cludoRecordList.length - validRecords.length) > 0) {
      newMessage.push((cludoRecordList.length - validRecords.length) + " records were ignored because of missings fields.")
    }
    if (response.errorCount > 0) {
      newMessage.push("An error ocurred while pushing " + response.errorCount + " valid records, please check the console for more information.")
    }
    setMessage(newMessage);
    setLoader(false);
  }

  return (
    <Box>
      <Box padding={3} borderBottom="thick">
        <Heading size="small" margin={0}>
          {table.name} / {view.name}
        </Heading>
        {/* Show the table description only if it exists */}
        {table.description && (
          <Text textColor="light" style={{
            whiteSpace: 'pre'
          }}>
            {table.description}
          </Text>
        )}
      </Box>
      <Box padding={3} borderBottom="thick">
        <Text>Select the Fields to be updated</Text>
        <FieldList  
          view={view} 
          setSelectedFields={setSelectedFields}
          selectedFields={selectedFields}>
        </FieldList>
      </Box>
      <Button 
        className='sync-button'
        variant="primary" 
        icon="play" 
        onClick={() => indexDoc()}>
          Sync!
      </Button>
      <Box margin={2} padding={3}>
        {
          loader ? <Loader scale={0.3}/> :
            message ? message.map(mes => <Text key={mes} size="large">{mes}</Text>): null
        }
      </Box> 
    </Box>
  );
}

export default Synchronizer;