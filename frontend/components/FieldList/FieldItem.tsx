import React, { useState } from 'react';

import {
  Box,
  Button, Icon,
} from '@airtable/blocks/ui';
import { Field } from '@airtable/blocks/models';

export interface FieldItemProps {
  field: Field
  handleSelectField: Function
}

function FieldItem({ field, handleSelectField }: FieldItemProps) {
  let [checked, setChecked] = useState(true);

  const handleClick= () => {
    setChecked(!checked)
    handleSelectField(field)
  }

  return (
    <Box margin={1}>
      <Button
        icon={checked ? "checkboxChecked" :"checkboxUnchecked"}
        onClick={() => handleClick()}>
        {field.name}
      </Button> 
    </Box>
  )
}

export default FieldItem;