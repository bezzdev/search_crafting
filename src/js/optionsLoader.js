var optionsLoader = function (options) {
  if (('one_character_only' in options) == false)
    options.one_character_only = false
  if (('score_search_lengths' in options) == false)
    options.score_search_lengths = true
  if (('search' in options) == false)
    options.search = ''
  if (('auto_search' in options) == false)
    options.auto_search = true
  if (('letter_penalty' in options) == false)
    options.letter_penalty = 0.6
  if (('junk_penalty' in options) == false)
    options.junk_penalty = 10
  if (('fail_penalty' in options) == false)
    options.fail_penalty = 1000
  return options;
}

export const OptionsLoader = optionsLoader;

