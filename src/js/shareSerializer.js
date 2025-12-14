var deserialize10 = function(encoded, items) {
  var rawJson = atob(encoded)
  var json = JSON.parse(rawJson)
  
  var result = {
    crafting: [],
    options: {},
    languages: []
  }

  json.c.forEach(craft => {
    let newCraft = {}
    tryGetValue(newCraft, "enabled", craft, "e"),
    tryGetValue(newCraft, "size", craft, "s"),
    tryGetValue(newCraft, "goals", craft, "g")
    newCraft.goals = newCraft.goals.map(g => items[g]),
    tryGetValue(newCraft, "inventory", craft, "i")
    newCraft.inventory = newCraft.inventory.map(i => items[i]),
    tryGetValue(newCraft, "weight", craft, "w")
    result.crafting.push(newCraft);
  })

  tryGetValue(result.options, "max_characters", json, "o.c");
  tryGetValue(result.options, "score_search_lengths", json, "o.l");
  tryGetValue(result.options, "optimize_unique_characters", json, "o.u");
  tryGetValue(result.options, "search", json, "o.s");
  tryGetValue(result.options, "auto_search", json, "o.as");
  tryGetValue(result.options, "letter_penalty", json, "o.lp");
  tryGetValue(result.options, "junk_penalty", json, "o.jp");
  tryGetValue(result.options, "has_junk_penalty", json, "o.hjp");
  tryGetValue(result.options, "fail_penalty", json, "o.fp");
  tryGetValue(result.options, "allow_permitted_items", json, "o.api");
  tryGetValue(result.options, "permit_goal_items", json, "o.pgi");
  tryGetValue(result.options, "permitted_items_benefit", json, "o.pib");
  tryGetValue(result.options, "permitted_items", json, "o.pi")
  result.options.permitted_items = result.options.permitted_items.map(p => items[p]);
  tryGetValue(result.options, "overlap_crafting", json, "o.co");
  tryGetValue(result.options, "overlap_penalty", json, "o.o");
  tryGetValue(result.options, "resource_id", json, "o.r");

  tryGetValue(result, "languages", json, "l");

  return result;
}

var tryGetValue = function (object, param, source, key) {
  try {
    var parts = key.split('.');
    var val = source;
    parts.forEach(key => {
      val = val[key]
    })
    object[param] = val
  } catch(e) {
    console.log(e);
  }
}


var shareSerialize = function (data, items) {
  var shareObject = {
    c: data.crafting.map(function (craft) {
      return { 
        e: craft.enabled, 
        s: craft.size, 
        g: craft.goals.map(g => items.indexOf(g)), 
        i: craft.inventory.map(i => items.indexOf(i)),
        w: craft.weight
      }
    }),
    o: {
      c: data.options.max_characters,
      l: data.options.score_search_lengths,
      u: data.options.optimize_unique_characters,
      s: data.options.search,
      as: data.options.auto_search,
      lp: data.options.letter_penalty,
      jp: data.options.junk_penalty,
      hjp: data.options.has_junk_penalty,
      fp: data.options.fail_penalty,
      api: data.options.allow_permitted_items,
      pgi: data.options.permit_goal_items,
      pib: data.options.permitted_items_benefit,
      pi: data.options.permitted_items.map(p => items.indexOf(p)),
      co: data.options.overlap_crafting,
      op: data.options.overlap_penalty,
      r: data.options.resource_id
    },
    l: data.languages
  }

  var json = JSON.stringify(shareObject);
  console.log(json);
  var encoded = btoa(json);

  return encoded;
}

var shareDeserialize = function (encoded, items) {
  var deserialized = null;

  deserialized = deserialize10(encoded, items);
  return deserialized;
}

export const ShareSerialize = shareSerialize;
export const ShareDeserialize = shareDeserialize;

