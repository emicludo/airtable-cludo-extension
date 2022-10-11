import React from 'react';

import { useGlobalConfig, Box, FormField, Input, Button } from '@airtable/blocks/ui';


function SettingsForm( setIsSettingsOpen: any) {
  const globalConfig = useGlobalConfig();

  const  customerId: unknown = globalConfig.get('customerId')
  const  apiKey: unknown = globalConfig.get('apiKey')
  const  crawlerId: unknown = globalConfig.get('crawlerId')

  //Types assertion
  const customerIdN = customerId as number
  const apiKeyS = apiKey as string
  const crawlerIdN = crawlerId as number

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    globalConfig.setAsync(event.target.name, event.target.value);
  }

  return (
    <Box margin={3}>
      <FormField label="Customer Id">
        <Input name="customerId" value={customerIdN.toString()} onChange={(e) => handleOnChange(e)} />
      </FormField>
      <FormField label="Api Key">
        <Input name="apiKey" value={apiKeyS} onChange={(e) => handleOnChange(e)} />
      </FormField>
      <FormField label="Crawler Id">
        <Input name="crawlerId" value={crawlerIdN.toString()} onChange={(e) => handleOnChange(e)} />
      </FormField>
      <Button
        size="large"
        variant="primary"
        onClick={() => setIsSettingsOpen(false)}>
          Done
      </Button>
    </Box> 
  )
}

export default SettingsForm;