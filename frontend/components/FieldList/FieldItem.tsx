import React, { useState } from 'react';

import { Box, Button, Icon, Input } from '@airtable/blocks/ui';
import { FieldWithAlias } from '../../interfaces';

import './FieldItem.css';

export interface FieldItemProps {
  field: FieldWithAlias
  handleSelectField: (newField: FieldWithAlias) => void;
}

function FieldItem({ field, handleSelectField }: FieldItemProps) {
  const [checked, setChecked] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [alias, setAlias] = useState("");

  const handleFieldClick = () => {
    setChecked(!checked)
    handleSelectField(field)
  }

  const handleSetAlias = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(event.target.value)
    field.alias = event.target.value
  }

  return (
    <div className='field-item_container'>
      <Box margin={1} className='field-item_main-box' >
        <Button>
          <div className='field-item_main-icon-and-name' onClick={()=> handleFieldClick()}>
            {/* Checkbox Icon */}
            <Icon 
              className='checkbox-icon' 
              name={checked ? "checkboxChecked" :"checkboxUnchecked"}
              size={15}/>
            <span>{field.name}</span>
          </div>
          {/* Transformation to Alias */}
          {field.alias ? <span>{' ---> '}{field.alias}</span> : null}
          {/* Edit Icon */}
          <Icon 
            className='edit-icon' 
            name="edit"
            onClick={()=> setEditOpen(!editOpen)}
            size={15}/>
        </Button> 
      </Box>
      { editOpen ? 
          <Box margin={1} className='field-item_edit-box'>
            <Input
              value={alias}
              onChange={e => handleSetAlias(e)}
              placeholder="Alias"
            />
            {/* Check/Save Icon */}
            <Icon 
              className='check-icon' 
              name="check"
              onClick={()=> setEditOpen(!editOpen)}
              size={16}/>
          </Box>
        : null}
    </div>
  )
}

export default FieldItem;