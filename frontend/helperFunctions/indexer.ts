import { CludoClient } from "@cludo/cludo-api-client";
import { CludoApiResult } from "@cludo/cludo-api-client/dist/interfaces/client-api-result.interface";
import { CludoIndexElement } from "../interfaces";

type IndexingResult = {
  errorCount: number
  totalPushed: number
}

/**
 * Indexes all documents passed as parameter using a CludoClient instance from cludo-api-client
 * @param  {CludoIndexElement[]} listToIndex
 * @param  {CludoClient} searchClient
 * @param  {any} crawlerId
 * @returns {Promise<IndexingResult>} Returns a Promise of an IndexingResult which includes the number of errors registered
 * and the total documents pushed succesfully
 */
async function parallelIndexDoc( listToIndex: CludoIndexElement[], 
                                 searchClient: CludoClient, 
                                 crawlerId: any) 
                                 : Promise<IndexingResult> {

  const promises: Promise<CludoApiResult<void>>[] = [];
  let totalErrors = 0;

  listToIndex.forEach(record => {
    promises.push(searchClient.content.indexDocument(crawlerId, record));
  });
  
  const promResponse = await Promise.all(promises);
  //Logs errors
  promResponse.forEach((res) => {
    if (res.error) {
      totalErrors++
      console.log(res.error.code + ". This was the message: " + res.error.messages.toString());
    }
  });

  return { errorCount: totalErrors, totalPushed: (listToIndex.length-totalErrors) }
}

export {parallelIndexDoc};