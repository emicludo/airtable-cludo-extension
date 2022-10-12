import React, { useEffect } from 'react';

import { Box, useViewMetadata } from '@airtable/blocks/ui';
import { View } from '@airtable/blocks/models';
import FieldItem from './FieldItem';
import { toggleElementInArray } from '../../helperFunctions/arrayHelpers';
import { FieldWithAlias } from '../../interfaces';

export interface FieldListProps {
  view: View
  setSelectedFields: (newFields: FieldWithAlias[]) => void;
  selectedFields: FieldWithAlias[]
  children: React.ReactNode
}

function FieldList( {view, setSelectedFields, selectedFields}: FieldListProps) {
  const viewMetadata = useViewMetadata(view);
  
  const handleSelectField = (fieldName: FieldWithAlias) => {
    setSelectedFields(toggleElementInArray(selectedFields,fieldName))
  }

  useEffect(() => {
    setSelectedFields(viewMetadata.visibleFields)
  }, []);

  return (
    <>
      <Box margin={1} style={{display: 'flex', flexWrap: 'wrap'}}>
        {viewMetadata.visibleFields.map((field: FieldWithAlias) => 
          <FieldItem key={field.id} field={field} handleSelectField={handleSelectField}/>
        )}
      </Box> 
    </>
  )
}

export default FieldList;