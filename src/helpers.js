export function handleResponse(json) {
  const sentencesArr = json.results[0].lexicalEntries[0].sentences;
  const sentences = sentencesArr.filter((sentence, i) => {
    return sentence.regions && sentence.regions[0] === 'North American';
  })
  .map((value) => {
    if (value.text) {
      return value.text;
    }
  });

  return {sentences};
}