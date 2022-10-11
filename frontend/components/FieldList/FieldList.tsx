import React, { useEffect } from 'react';

import { Box, useViewMetadata } from '@airtable/blocks/ui';
import { Field, View } from '@airtable/blocks/models';
import FieldItem from './FieldItem';
import { toggleElementInArray } from '../../helperFunctions/arrayHelpers';

export interface FieldListProps {
  view: View
  setSelectedFields: (newFields: Field[]) => void;
  selectedFields: Field[]
  children: React.ReactNode
}

function FieldList( {view, setSelectedFields, selectedFields}: FieldListProps) {
  const viewMetadata = useViewMetadata(view);
  
  const handleSelectField = (fieldName: Field) => {
    setSelectedFields(toggleElementInArray(selectedFields,fieldName))
  }

  useEffect(() => {
    setSelectedFields(viewMetadata.visibleFields)
  }, []);

  return (
    <>
      <Box margin={1} style={{display: 'flex', flexWrap: 'wrap'}}>
        {viewMetadata.visibleFields.map((field: Field) => 
          <FieldItem key={field.id} field={field} handleSelectField={handleSelectField}/>
        )}
      </Box> 
    </>
  )
}

export default FieldList;