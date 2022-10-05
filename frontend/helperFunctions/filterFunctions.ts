function isRecordSelected(recordId: string, selectedIdList: string[]) : boolean {
  console.log(selectedIdList)
  console.log(recordId)
  console.log("------------")
  return selectedIdList.includes(recordId);
}

export {isRecordSelected};