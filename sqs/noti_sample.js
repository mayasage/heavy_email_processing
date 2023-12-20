const notiSample = `
{
  "receivedDateTime@odata.type":"#DateTimeOffset",
  "receivedDateTime":"2021-12-30T10:53:35Z",
  "subject":"TEST MESSAGE FOR RICH NOTIFICATIONS",
  "bodyPreview":"Hello,\r\n\r\nWhat\u2019s up?\r\n\r\nThanks\r\nMegan",
  "importance@odata.type":"#microsoft.graph.importance",
  "importance":"normal",
  "from": {
      "@odata.type":"#microsoft.graph.recipient",
      "emailAddress": {
          "@odata.type":"#microsoft.graph.emailAddress",
          "name":"Megan Brown",
          "address":"Megan.Brown@microsoft.com"
      }
  }
}
`;

export default notiSample;
