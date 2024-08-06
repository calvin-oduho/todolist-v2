
/**
 * This function gets today's date and returns it.
 */
exports.getDate = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
};


/**
 * Simply gets current day and returns it.
 */
exports.getDay = () => {
  const today = new Date();
  const options = {
    weekday: "long",
  };
  return today.toLocaleDateString("en-US", options);
};

exports.getYear = () => {
  const today = new Date();
  const options = {
    year: "numeric",
  };
  return today.toLocaleDateString("en-US", options);
};


/**
 * @param {*} userInput 
 * @returns capitalized version of user's input.
 */
exports.capitalize = (userInput) => {
  const splitWords = userInput.split(' ');
  const capitalizedWords = splitWords.map( (eachWord) => {
      return eachWord[0].toUpperCase() + eachWord.substring(1);
  } );
  return capitalizedWords.join(' ');
};
