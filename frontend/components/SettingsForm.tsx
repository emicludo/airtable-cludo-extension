import React from 'react';
import PropTypes from 'prop-types';

import {
  useGlobalConfig,
  Box,
  FormField,
  Input,
  Button
} from '@airtable/blocks/ui';

function SettingsForm({ setIsSettingsOpen }: any) {
  const globalConfig = useGlobalConfig();

  const customerId: any = globalConfig.get('customerId');
  const apiKey : any  = globalConfig.get('apiKey');
  const crawlerId: any  = globalConfig.get('crawlerId');

  const handleOnChange = (event: any) => {
    globalConfig.setAsync(event.target.name, event.target.value);
  }

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
      <Button
        size="large"
        variant="primary"
        onClick={() => setIsSettingsOpen(false)}
      >
                    Done
      </Button>
    </Box> 
  )
}

SettingsForm.propTypes = {
  setIsSettingsOpen: PropTypes.func.isRequired,
};

export default SettingsForm;