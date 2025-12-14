import { RecipeGroups } from './recipeGroups.js';
import { Languages } from './languages.js';
import { LanguageTooltips } from './languageTooltips.js';

var crafting = {
  items: {},
  scoreSort: function compare(a, b) {
    if (a.score < b.score) {
      return -1;
    } else if (a.score > b.score) {
      return 1;
    }
    return 0;
  },
  setItems: function (items) {
    let self = this;
    items.forEach(item => {
      let translation = item.replace("block.minecraft.", "").replace("item.minecraft.", "");
      self.items[item] = translation;
    })
  },
  getRelevantGroupsForInventory: function (groups, size, inventory) {
    var relevant = []
    groups.forEach(function(group) {
      var group_relevant = false;
      group.forEach(function(recipe) {
        var craftable = true;
        if (recipe.size > size) {
          craftable = false;
        } else {
          recipe.ingredients.forEach(function(ingredient) {
            if (!ingredient.some(ing => inventory.includes(ing))) {
              // does not have ingredient
              craftable = false;
            }
          })
        }
        if (craftable) {
          group_relevant = true;
        }
      })

      if (group_relevant) {
        relevant.push(group);
      }
    })
    return relevant;
  },
  getTranslation: function (translations, item) {
      return translations[item].toLowerCase();
  },
  getLongerSearches: function (goals, groups, translations, searches) { // translations, searches) {
    let self = this;

    var new_searches = []
    goals.forEach(function(item) {
      groups.filter(group => group.some(recipe => recipe.output == item)).forEach(function(group) {
        group.forEach(function(recipe) {
          var translation = self.getTranslation(translations, recipe.output);

          searches.forEach(function(search) {
            for(var i = 0; i < translation.length - search.length; i++) {
              if (translation.substring(i, i + search.length) == search) {
                var new_char = translation[i + search.length];
                if(!self.option_values.badCharacters.includes(new_char)) {
                  var new_search = search + new_char;
                  if (!new_searches.includes(new_search)) {
                    new_searches.push(new_search)
                  }
                }
              }
            }

            if (search[0] == ':') {
              var target = search.substring(1);
              var source = self.items[recipe.output];
              for(var j = 0; j < source.length - target.length; j++) {
                if (source.substring(j, j + target.length) == target) {
                  var new_char2 = source[j + target.length];
                  if(!self.option_values.badCharacters.includes(new_char2)) {
                    var new_search2 = search + new_char2;

                    if (!new_searches.includes(new_search2)) {
                      new_searches.push(new_search2)
                    }
                  }
                }
              }
            }
          })
        })
      })
    })

    var valid_searches = self.validateSearches(goals, groups, translations, new_searches)
    return valid_searches;
  },
  matchItem: function (key, translations, search) {
    let self = this;
    if (search.includes(':')) {
      const split = search.indexOf(':');
      const before = search.substring(0, split);
      if (before != "" || "minecraft".includes(before) == false) {
        return false;
      }
      const after = search.substring(split + 1);
      return after == "" || self.getTranslation(translations, key).includes(after) || self.items[key].includes(after);
    } else {
      return self.getTranslation(translations, key).includes(search);
    }
  },
  validateSearches: function (goals, groups, translations, searches) {
    let self = this;
    var valid_searches = []
    searches.forEach(function(search) {
      if(goals.every(function(goal) {
        var found = groups.find(function(group) { 
          return group.some(function(recipe) { 
            return recipe.output == goal
          }) && group.some(function (recipe) {
            return self.matchItem(recipe.output, translations, search);
          })
        })
        return found != null;
      })) {
        valid_searches.push(search); 
      }
    })
    return valid_searches;
  },
  getSearchesForItems: function (goals, groups, translations) {
    var self = this;
    
    var searches = []
    if (self.options.resource_id) {
      searches.push(':');
    }

    // get all 1 character searches
    goals.forEach(function(item) {
      groups.filter(group => group.some(recipe => recipe.output == item)).forEach(function(group) {
        group.forEach(function(recipe) {
          var translation = self.getTranslation(translations, recipe.output);
          // item_translations.push(translation);

          for(var c = 0; c < translation.length; c++) {
            var ch = translation[c]
            if (!searches.includes(ch) && !self.option_values.badCharacters.includes(ch)) {
              // get all matching characters for these keys
              searches.push(ch);
            }
          }
        })
      })
    })

    // filter to searches that find everything
    var valid_searches = self.validateSearches(goals, groups, translations, searches)

    if (this.option_values.max_characters >= 2) {
      var two_length_searches = self.getLongerSearches(goals, groups, translations, valid_searches);

      valid_searches = valid_searches.concat(two_length_searches);
    }

    return valid_searches
  },
  searchGroups: function (groups, translations, search) {
    let self = this;
    var found = []
    groups.forEach(function(group) {
      var matched = false;
      group.forEach(function(recipe) {
        if(self.matchItem(recipe.output, translations, search)) {
          matched = true;
        }
      })
      if (matched) {
        found.push(group);
      }
    })
    return found;
  },
  getRecipesForGroups: function (groups, inventory) {
    var recipes = []
    groups.forEach(function(group) {
      group.forEach(function(recipe) {
        var craftable = true;
        recipe.ingredients.forEach(function(ingredient) {
          if (!ingredient.some(ing => inventory.includes(ing))) {
            // does not have ingredient
            craftable = false;
          }
        })
        if (craftable) {
          recipes.push(recipe.output)
        }
      })
    })
    return recipes;
  },
  scoreSearch: function(search, junk, boost) {
    var remainder = junk;
    var letters = search;
    
    if (!this.options.score_search_lengths)
      letters = 1;

    var letter_penalty = this.option_values.letter_penalty *  (letters - 1);

    var junk_penalty = remainder * this.option_values.junk_penalty;
    if (remainder > 0) {
      junk_penalty += this.option_values.has_junk_penalty
    }
    return letter_penalty + junk_penalty + boost
  },
  getUniqueCharacters: function (items) {
    // get all characters
    var characters = []
    items.forEach(function (item) {
      characters = characters.concat(item.split(''))
    })

    // get unique characters
    var unique_characters = characters.filter(function(value, index, array) {
      return array.indexOf(value) === index;
    })
    return unique_characters;
  },
  getBestCharacterPermutation: function (fixed_characters, choices, search_variations) {
    let self = this;

    var current = search_variations[0];

    var best_cost = -1;
    var best_choices = null;
    current.forEach(function (option) {
      var additional_characters = option.split('').filter(c => !fixed_characters.includes(c));
      var new_characters = fixed_characters.concat(additional_characters)
      
      var new_choices = [].concat(choices)
      new_choices.push(option)

      if (search_variations.length > 1) {
        var next_options = [].concat(search_variations)
        next_options.splice(0, 1);
        
        var result = self.getBestCharacterPermutation(new_characters, new_choices, next_options)
        var cost = result.cost;

        if (best_choices == null || cost < best_cost) {
          best_cost = cost;
          best_choices = result.choices;
        }
      } else {
        var bottom_cost = new_characters.length;

        if (best_choices == null || bottom_cost < best_cost) {
          best_cost = bottom_cost;
          best_choices = new_choices;
        }
      }
    })

    return { choices: best_choices, cost: best_cost };
  },
  minimizeLanguageCharacters: function (translation_result) {
    var self = this;
    var interchangeable = []
    
    // find interchangeable results
    translation_result.crafts.forEach(function(craft) {
      if (craft.best_search != null && craft.best_searches.length > 0) {
        if (craft.best_search.score == craft.best_searches[0].score) {
          interchangeable.push(craft)
        }
      }
    });
    
    // get all characters
    var searches = translation_result.crafts.filter(craft => !interchangeable.includes(craft) && craft.best_search != null).map(c => c.best_search.search_term)
    var unique_characters = this.getUniqueCharacters(searches) 
    
    var not_solved = []

    translation_result.crafts.forEach(function(craft) {
      if (craft.best_search != null && craft.best_searches.length > 0) {
        if (craft.best_search.score == craft.best_searches[0].score) {
          // current solution is already good
          if(craft.best_search.search_term.split('').every(c => unique_characters.includes(c))) {
            return;
          } else {
            // otherwise

            // find a valid replacement
            var valid_replacement = craft.best_searches.find(s => s.score == craft.best_search.score && s.search_term.split('').every(c => unique_characters.includes(c)))
            if (valid_replacement != null) {
              // override the best_search
              craft.best_searches.splice(0, 0, craft.best_search);
              craft.best_search = valid_replacement;
              craft.best_searches.splice(craft.best_searches.indexOf(valid_replacement), 1);
              return;
            }
          }
          // try to find a best permutation later
          not_solved.push(craft)
        }
      }
    })

    interchangeable = not_solved

    if (interchangeable.length > 0) {
      var permutations = 1
      interchangeable.forEach(function (inter) {
        var options = inter.best_searches.filter(s => s.score == inter.best_searches[0].score).length + 1;
        permutations = permutations * options;
      })
      
      if (permutations < 25000) {
        interchangeable.forEach(function (inter) {
          inter.best_searches.splice(0, 0, inter.best_search)
          inter.best_search = null;
        })

        // calculate unique characters
        searches = translation_result.crafts.filter(craft => craft.best_search != null).map(c => c.best_search.search_term)
        unique_characters = self.getUniqueCharacters(searches) 

        // work out best permutation of the interchangeable search options
        var search_options = interchangeable.map(function(interchange) {
          var score_to_match = interchange.best_searches[0].score;
          return interchange.best_searches.filter(function(search) {
            return search.score == score_to_match
          }).map(function(s) {
            return s.search_term;
          })
        })
        var best_permutation = self.getBestCharacterPermutation(unique_characters, [], search_options);

        for(var i = 0; i < interchangeable.length; i++) {
          var interchange = interchangeable[i] 
          var found_best = interchange.best_searches.find(s => s.search_term == best_permutation.choices[i])
          interchange.best_search = found_best;
          interchange.best_searches = interchange.best_searches.filter(s => s.search_term != best_permutation.choices[i])
        }
      }
    }

    unique_characters = self.getUniqueCharacters(translation_result.crafts.filter(craft => craft.best_search != null).map(c => c.best_search.search_term))
    translation_result.unique_characters = unique_characters;
    translation_result.unique_character_count = unique_characters.length;
  },
  scoreSearches: function (goals, inventory, groups, translations, searches) {
    var self = this;
    var scored_search_results = []
    searches.forEach(function(search) {
      var results = self.searchGroups(groups, translations, search);

      var junk = results.filter(g => !g.some(r => goals.includes(r.output)) )
      var boost = 0
      if(self.options.allow_permitted_items) {
        var without_additional = junk.filter(g => !g.some(r => self.permittedItems.includes(r.output)))
        var additional = junk.length - without_additional.length;
        boost = -self.option_values.permitted_items_benefit * additional;
        junk = without_additional;
      }

      var score = self.scoreSearch(search.length, junk.length, boost);

      scored_search_results.push({
        search_term: search,
        results: self.getRecipesForGroups(results, inventory),
        overlap: false,
        score: score
      })
    })
    return scored_search_results;
  },
  getAllSearchesForItems: function (goals, inventory, groups, translations) {
    let self = this;
    var searches = self.getSearchesForItems(goals, groups, translations);
    var last_searches = searches;

    var latest_results = self.scoreSearches(goals, inventory, groups, translations, searches);

    var scored_search_results = [];
    scored_search_results = scored_search_results.concat(latest_results);

    var acceptable = goals.length;
    if (self.option_values.max_characters >= 2) {
      for(var i = 3; i <= self.option_values.max_characters; i++) {
        var found = scored_search_results.filter(r => r.results.length == acceptable).length > 5;
        // dont find longer searches if we've found the best results
        if (!found) {
          var next_searches = self.getLongerSearches(goals, groups, translations, last_searches).filter(s => !searches.includes(s));
                  
          latest_results = self.scoreSearches(goals, inventory, groups, translations, next_searches);
          scored_search_results = scored_search_results.concat(latest_results);
          last_searches = next_searches;
        } else {
          break;
        }
      }
    }
    return scored_search_results;
  },
  getResults: function (options, crafts, valid_languages, permitted_items) {
    var self = this;
    var results = []
    self.options = options;
    self.permittedItems = permitted_items;

    self.option_values = {
      badCharacters: ["□"],
      letter_penalty: parseFloat(self.options.letter_penalty),
      junk_penalty: parseFloat(self.options.junk_penalty),
      has_junk_penalty: parseFloat(self.options.has_junk_penalty),
      fail_penalty: parseFloat(self.options.fail_penalty),
      permitted_items_benefit:  parseFloat(self.options.permitted_items_benefit),
      max_characters: parseInt(self.options.max_characters),
      overlap_penalty: parseFloat(self.options.overlap_penalty)
    }

    var keys = Languages.map(l => l.key)

    var all_languages = keys.map(k => Languages.find(l => l.key == k))
    // var valid_languages = ["gd_gb"]; // all_languages;

    var valid_crafts = crafts.filter(c => c.goals.length > 0 && c.inventory.length > 0);
    valid_crafts.forEach(function (craft) {
      var groups = self.getRelevantGroupsForInventory(RecipeGroups, parseInt(craft.size), craft.inventory)
      
      var valid = true;
      craft.goals.forEach(function (goal) {
        var found_craftable = groups.find(g => g.find(r => r.output == goal))
        if (found_craftable == null) {
          valid = false;
        }
      })
      craft.valid = valid;
    })
    var enabled_crafts = valid_crafts.filter(c => c.enabled);
    
    all_languages.forEach(function(language) {
      var translations = LanguageTooltips[language.key];

      var translation_result = {
        language_name: language.name,
        language_region: language.region,
        warning: language.warning,
        localized: language.localized,
        language_key: language.key,
        translations: translations,
        crafts: [],
        unique_character_count: 0,
        unique_characters: [],
        score: 0,
        completed: false,
        disabled: false
      }

      if (!valid_languages.includes(language.key)) {
        translation_result.disabled = true;
        results.push(translation_result)
      } else {
        enabled_crafts.forEach(function(craft) {
          if (craft.valid) {
            var groups = self.getRelevantGroupsForInventory(RecipeGroups, craft.size, craft.inventory)

            var scored_search_results = self.getAllSearchesForItems(craft.goals, craft.inventory, groups, translations);
            // var scored_search_results = self.getAllSearchesForItems(craft, groups, self.items);

            if (self.options.overlap_crafting) {
              var acceptable = craft.goals.length;
              if (craft.goals.length == 2) { // only try overlapping for searches of 2 goals
                var lowest_score = Math.min(...scored_search_results.map(s => s.score));

                if (!(scored_search_results.find(r => r.results.length == acceptable) != null)) { // only try if we dont have a better search
                  var goal_a = [craft.goals[0]];
                  var goal_b = [craft.goals[1]];

                  var searches_a = self.getAllSearchesForItems(goal_a, craft.inventory, groups, translations);
                  var searches_b = self.getAllSearchesForItems(goal_b, craft.inventory, groups, translations);

                  var filtered_a = searches_a.filter(s => s.score < lowest_score && s.search_term.length >= 1).sort(self.scoreSort);
                  var filtered_b = searches_b.filter(s => s.score < lowest_score && s.search_term.length >= 1).sort(self.scoreSort);
                  
                  var overlaps = []
                  if (filtered_a && filtered_b) {
                    filtered_a.forEach(function(search_a) {
                      filtered_b.forEach(function(search_b) {
                        var search_left = search_a;
                        var search_right = search_b;

                        if (search_b.search_term.length < search_a.search_term.length) {
                          search_left = search_b;
                          search_right = search_a;
                        }

                        var overlap_score = search_left.score + search_right.score + self.option_values.overlap_penalty;
                        if (overlap_score < lowest_score) {
                          var overlap = true;
                          for (var c = 0; c < search_left.search_term.length; c++) {
                            if (search_left.search_term[c] != search_right.search_term[c]) {
                              break;
                            } else {
                              overlap = true;
                            }
                          }

                          if (overlap) {
                            var left = search_left.search_term;
                            var right = search_right.search_term.substring(c);
                            var backspaces = left.length - c;
                            var middle = "<".repeat(backspaces);
                            var overlap_search = left + middle + right;
                            
                            if (!overlaps.find(o => o.search_term == overlap_search)) {
                              // we have an overlap
                              var results_left = self.searchGroups(groups, translations, search_left.search_term);
                              var results_right = self.searchGroups(groups, translations, search_right.search_term);

                              overlap_score = search_left.score + search_right.score + (self.option_values.overlap_penalty * backspaces);

                              overlaps.push({
                                search_term: overlap_search,
                                results: self.getRecipesForGroups(results_left, craft.inventory).concat(self.getRecipesForGroups(results_right, craft.inventory)),
                                overlap: true,
                                score: overlap_score
                              })
                            }
                          }
                        }
                      })
                    })
                    overlaps = overlaps.sort(self.scoreSort);
                    scored_search_results = scored_search_results.concat(overlaps);
                  }
                }
              }
            }

            var best_searches = []
            var best_search = null

            if (scored_search_results.length > 0) {
              scored_search_results.sort(self.scoreSort);
              
              best_search = scored_search_results[0]
            }

            if (scored_search_results.length > 1) {
              scored_search_results.splice(0, 1);
              var same_scores = scored_search_results.filter(s => s.score == best_search.score).length

              var take = Math.max(same_scores, 6);
              best_searches = scored_search_results.slice(0, take);
            }

            translation_result.crafts.push({
              goals: craft.goals,
              valid: true,
              best_search: best_search,
              best_searches: best_searches
            })
          } else {
              translation_result.crafts.push({
              goals: craft.goals,
              valid: false,
              best_search: null,
              best_searches: []
            })
          }

          if (best_search != null) {
            translation_result.score += best_search.score * craft.weight
          } else {
            translation_result.score += self.option_values.fail_penalty * craft.weight
          }
        })

        // calculate unique characters
        var unique_characters = self.getUniqueCharacters(translation_result.crafts.filter(craft => craft.best_search != null).map(c => c.best_search.search_term))
        translation_result.unique_characters = unique_characters;
        translation_result.unique_character_count = unique_characters.length;

        translation_result.completed = true;
        results.push(translation_result)
      }
    })

    results.sort(self.scoreSort);

    if (self.options.optimize_unique_characters) {
      results.forEach(function(result) {
        self.minimizeLanguageCharacters(result)
      })
    }

    return results;
  }
}
export const Crafting = crafting;