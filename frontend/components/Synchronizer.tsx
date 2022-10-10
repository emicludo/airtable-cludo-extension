import React, { useState } from 'react';

//Airtable Blocks
import { Box, Heading, Text, useViewMetadata, useRecords, Button, Loader } from '@airtable/blocks/ui';
import { Table, View, Cursor, Field } from '@airtable/blocks/models';
import GlobalConfig from '@airtable/blocks/dist/types/src/global_config';

//Cludo API Client
import { CludoClient } from "@cludo/cludo-api-client";

//Helper Functions
import { recordListConverter } from '../helperFunctions/typeParser'
import { removeValidandId } from '../helperFunctions/filterFunctions';
import { parallelIndexDoc } from '../helperFunctions/indexer'

//Custom components
import Form from './Form';
import FieldList from './FieldList/FieldList';

export interface SynchronizerProps {
    table: Table,
    view: View,
    globalConfig: GlobalConfig,
    cursor: Cursor
}

function Synchronizer ({table, view, globalConfig, cursor}: SynchronizerProps) {
  //Local State
  let [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);

  //Airtable Hooks
  const viewMetadata = useViewMetadata(view);
  const records = useRecords(table);

  const customerId: any = globalConfig.get('customerId');
  const apiKey : any  = globalConfig.get('apiKey');
  const crawlerId: any  = globalConfig.get('crawlerId');

  /**
   * Indexes all rows selected by the user that pass the validations
   * @returns {Promise<void>}
   */
  const indexDoc = async (): Promise<void> => {
    //Pre-validations
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
    //Instanciates new Cludo object, Engine??
    const searchClient = new CludoClient({
      customerId: customerId,
      engineId: 111111,
      apiKey: apiKey,
    });

    //Filters by selected rows
    const selectedRecords = records.filter(record =>  cursor.selectedRecordIds.includes(record.id))
    if (selectedRecords.length==0) {
      setMessage("Please select some records from the table before syncing.")
      return
    }
    
    //Converts list from Airtable format to CludoIndexElement[]
    const cludoRecordList = recordListConverter(selectedRecords, selectedFields)

    //Filters only valid records (with Title, URL and Description fields)
    const validRecords = cludoRecordList.filter(record => record.valid)
      .map(rec => removeValidandId(rec));
    if (validRecords.length==0) {
      setMessage("The selected records are not valid. Please check that Url, Description and Title fields are filled and in an appropiate format ('URL' for Url and 'Long text'/'Single Line text' for Title and Description")
      return
    }
    
    setLoader(true);
    let response = await parallelIndexDoc(validRecords, searchClient, crawlerId)
    setLoader(false)

    setMessage(response.totalPushed + " rows have been pushed. \n\n" + (cludoRecordList.length - validRecords.length) + " records were ignored because of missings fields.")
    if (response.errorCount > 0) {
      setMessage(message + "\n\n An error ocurred while pushing " + response.errorCount + " valid records, please check the console for more information.")
    }
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
      <Button variant="primary" 
        icon="play" 
        onClick={() => indexDoc()}>
          Sync!
      </Button>
      <Box margin={2}>
        {
          loader ? <Loader scale={0.3}/> :
            message ? <Text size="large">{message}</Text>: null
        }
      </Box> 
    </Box>
  );
}

export default Synchronizer;