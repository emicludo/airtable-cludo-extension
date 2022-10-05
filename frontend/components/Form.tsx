import React from 'react';

import { Box, Button, FormField, Input, Text, Loader } from '@airtable/blocks/ui';

type FormProps = {
  customerId: number
  apiKey : string
  crawlerId: number  
  message: string
  loader: boolean
  indexDoc: Function
  handleOnChange: Function
  children: React.ReactNode;
};

/**
 * returns the Form with inputs CustomerId, Api Key and CrawlerId, Sync button and Feedback message.
 * @param  {number} customerId
 * @param  {string} apiKey
 * @param  {number} crawlerId
 * @param  {Function} indexDoc function that updates the modified rows on the real index
 * @param  {string} message message to be displayed as feedback to the user
 * @param  {Function} handleOnChange updates the globalConfig variables when the input fields from the form are changed
 * @param  {boolean} loader turns on/off the loader rendering
 */
export default function Form({
    customerId,
    apiKey,
    crawlerId,
    indexDoc,
    message,
    handleOnChange,
    loader
  }: FormProps ) {
  return (
    <Box margin={3}>
      <FormField label="Customer Id">
          <Input name="customerId" value={customerId.toString()} onChange={(e) => handleOnChange(e)} />
      </FormField>
      <FormField label="Api Key">
          <Input name="apiKey" value={apiKey} onChange={(e) => handleOnChange(e)} />
      </FormField>
      <FormField label="Crawler Id">
          <Input name="crawlerId" value={crawlerId.toString()} onChange={(e) => handleOnChange(e)} />
      </FormField>
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
  )
}