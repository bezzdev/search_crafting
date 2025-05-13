var optionsLoader = function (options, defaults) {
  if (!checkProperty(options, 'max_characters'))
    options.max_characters = defaults.max_characters
  if (!checkProperty(options, 'score_search_lengths'))
    options.score_search_lengths = defaults.score_search_lengths
  if (!checkProperty(options, 'optimize_unique_characters'))
    options.optimize_unique_characters = defaults.optimize_unique_characters
  if (!checkProperty(options, 'search'))
    options.search = defaults.search
  if (!checkProperty(options, 'auto_search'))
    options.auto_search = defaults.auto_search
  if (!checkProperty(options, 'letter_penalty'))
    options.letter_penalty = defaults.letter_penalty
  if (!checkProperty(options, 'junk_penalty'))
    options.junk_penalty  = defaults.junk_penalty
  if (!checkProperty(options, 'has_junk_penalty'))
    options.has_junk_penalty = defaults.has_junk_penalty
  if (!checkProperty(options, 'fail_penalty'))
    options.fail_penalty = defaults.fail_penalty
  if (!checkProperty(options, 'allow_permitted_items'))
    options.allow_permitted_items = defaults.allow_permitted_items
  if (!checkProperty(options, 'permit_goal_items'))
    options.permit_goal_items = defaults.permit_goal_items
  if (!checkProperty(options, 'permitted_items_benefit'))
    options.permitted_items_benefit = defaults.permitted_items_benefit
  if (!checkProperty(options, 'permitted_items'))
    options.permitted_items = defaults.permitted_items
  if (!checkProperty(options, 'overlap_crafting'))
    options.overlap_crafting = defaults.overlap_crafting
  if (!checkProperty(options, 'overlap_penalty'))
    options.overlap_penalty = defaults.overlap_penalty
  return options;
}

var checkProperty = function(obj, prop) {
  if ((prop in obj) == false || obj[prop] == undefined)
    return false;
  return true;
}

export const OptionsLoader = optionsLoader;

