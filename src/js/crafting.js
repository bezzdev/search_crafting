import { RecipeGroups } from './recipeGroups.js';
import { Languages } from './languages.js';
import { LanguageTooltips } from './languageTooltips.js';

var crafting = {
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
  getLongerSearches: function (goals, groups, translations, searches) { // translations, searches) {
    let self = this;

    var new_searches = []
    goals.forEach(function(item) {
      groups.filter(group => group.some(recipe => recipe.output == item)).forEach(function(group) {
        group.forEach(function(recipe) {
          var translation = translations[recipe.output].toLowerCase();

          searches.forEach(function(search) {
            for(var i = 0; i < translation.length; i++) {
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
          })
        })
      })
    })

    var valid_searches = self.validateSearches(goals, groups, translations, new_searches)
    return valid_searches;
  },
  validateSearches: function (goals, groups, translations, searches) {
    var valid_searches = []
    searches.forEach(function(search) {
      if(goals.every(function(goal) {
        var found = groups.find(function(group) { 
          return group.some(function(recipe) {
            return recipe.output == goal
          }) && group.some(function(recipe) { 
            return translations[recipe.output].includes(search)
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
    
    // var item_translations = []
    var searches = []

    goals.forEach(function(item) {
      groups.filter(group => group.some(recipe => recipe.output == item)).forEach(function(group) {
        group.forEach(function(recipe) {
          var translation = translations[recipe.output].toLowerCase();
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

    var valid_searches = self.validateSearches(goals, groups, translations, searches)

    if (this.option_values.max_characters >= 2) {
      var two_length_searches = self.getLongerSearches(goals, groups, translations, valid_searches);

      valid_searches = valid_searches.concat(two_length_searches);
    }

    return valid_searches
  },
  searchGroups: function (groups, translations, search) {
    var found = []
    groups.forEach(function(group) {
      var matched = false;
      group.forEach(function(recipe) {
        var output = translations[recipe.output];
        if (output.toLowerCase().includes(search)) {
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

    var letter_penalty = this.option_values.letter_penalty * Math.pow(letters - 1, 3);

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
  scoreSearches: function (goals, craft, groups, translations, searches) {
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
        results: self.getRecipesForGroups(results, craft.inventory),
        overlap: false,
        score: score
      })
    })
    return scored_search_results;
  },
  getResults: function (options, crafts) {
    var self = this;
    var results = []
    self.options = options;

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

    var test_languages = keys.map(k => Languages.find(l => l.key == k))

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
    
    test_languages.forEach(function(language) {
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
        score: 0
      }

      enabled_crafts.forEach(function(craft) {
        if (craft.valid) {
          var groups = self.getRelevantGroupsForInventory(RecipeGroups, craft.size, craft.inventory)
          var searches = self.getSearchesForItems(craft.goals, groups, translations);
          var last_searches = searches;

          var scored_search_results = []
          var latest_results = self.scoreSearches(craft.goals, craft, groups, translations, searches);

          scored_search_results = scored_search_results.concat(latest_results);

          var acceptable = craft.goals.length;
          if (self.option_values.max_characters >= 2) {
            for(var i = 3; i <= self.option_values.max_characters; i++) {
              var found = latest_results.filter(r => r.results.length == acceptable) > 5;
              if (!found) {
                var next_searches = self.getLongerSearches(craft.goals, groups, translations, last_searches);
                next_searches = next_searches.filter(s => !searches.includes(s));
                
                latest_results = self.scoreSearches(craft.goals, craft, groups, translations, next_searches);
                scored_search_results = scored_search_results.concat(latest_results);
                last_searches = next_searches;
              } else {
                break;
              }
            }
          }

          if (self.options.overlap_crafting) {
            if (craft.goals.length == 2) { // only try overlapping for searches of 2 goals
              if (!(latest_results.find(r => r.results.length == acceptable) != null)) { // only try if we dont have a better search
                var goal_a = [craft.goals[0]];
                var goal_b = [craft.goals[1]];

                var searches_a = self.getSearchesForItems(goal_a, groups, translations).filter(s => s.length == 2);
                var searches_b = self.getSearchesForItems(goal_b, groups, translations).filter(s => s.length == 2);

                for(var sa = 0; sa < searches_a.length; sa++) {
                  var search_a = searches_a[sa];
                  for (var sb = 0; sb < searches_b.length; sb++) {
                    var search_b = searches_b[sb];
                    if (search_a[0] == search_b[0]) {
                      // we have an overlap
                      var score_a = self.scoreSearches(goal_a, craft, groups, translations, [search_a])[0];
                      var score_b = self.scoreSearches(goal_b, craft, groups, translations, [search_b])[0];

                      var results_a = self.searchGroups(groups, translations, search_a);
                      var results_b = self.searchGroups(groups, translations, search_b);

                      var combinedScore = score_a.score + score_b.score + self.option_values.overlap_penalty;

                      let combined_score = {
                        search_term: search_a + "<" + search_b[1],
                        results: self.getRecipesForGroups(results_a, craft.inventory).concat(self.getRecipesForGroups(results_b, craft.inventory)),
                        overlap: true,
                        score: combinedScore
                      }

                      scored_search_results.push(combined_score);
                    }
                  }
                }
              }
            }
          }

          var best_searches = []
          var best_search = null

          if (scored_search_results.length > 0) {
            scored_search_results.sort(function compare(a, b) {
              if (a.score < b.score) {
                return -1;
              } else if (a.score > b.score) {
                return 1;
              }
              return 0;
            })
            
            best_search = scored_search_results[0]
          }

          if (scored_search_results.length > 1) {
            scored_search_results.splice(0, 1);
            var same_scores = scored_search_results.filter(s => s.score == best_search.score).length

            var take = Math.max(same_scores, 5);
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

      results.push(translation_result)
    })

    results.sort(function compare(a, b) {
      if (a.score < b.score) {
        return -1;
      } else if (a.score > b.score) {
        return 1;
      }
      return 0;
    })

    if (self.options.optimize_unique_characters) {
      results.forEach(function(result) {
        self.minimizeLanguageCharacters(result)
      })
    }

    return results;
  }
}
export const Crafting = crafting;