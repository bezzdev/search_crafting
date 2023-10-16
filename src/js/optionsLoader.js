var optionsLoader = function (options) {
  if (!checkProperty(options, 'one_character_only'))
    options.one_character_only = false
  if (!checkProperty(options, 'score_search_lengths'))
    options.score_search_lengths = true
  if (!checkProperty(options, 'search'))
    options.search = ''
  if (!checkProperty(options, 'auto_search'))
    options.auto_search = true
  if (!checkProperty(options, 'letter_penalty'))
    options.letter_penalty = 0.6
  if (!checkProperty(options, 'junk_penalty'))
    options.junk_penalty = 10
  if (!checkProperty(options, 'fail_penalty'))
    options.fail_penalty = 1000
  return options;
}

var checkProperty = function(obj, prop) {
  if ((prop in obj) == false || obj[prop] == undefined)
    return false;
  return true;
}

export const OptionsLoader = optionsLoader;

