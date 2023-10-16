var deserialize1 = function (encoded, items) {
  var rawJson = atob(encoded)
  var json = JSON.parse(rawJson)
  json.crafting.forEach(function (craft) {
    craft.goals = craft.goals.map(g => items[g])
    craft.inventory = craft.inventory.map(i => items[i])
  })
  return json;
}

var deserialize2 = function(encoded, items) {
  var rawJson = atob(encoded)
  var json = JSON.parse(rawJson)
  
  var result = {
    crafting: json.c.map(craft => {
      return {
        enabled: craft.e,
        size: craft.s,
        goals: craft.g.map(g => items[g]),
        inventory: craft.i.map(i => items[i])
      }
    }),
    options: {
      one_character_only: json.o.o,
      score_search_lengths: json.o.l,
      search: json.o.s
    }
  }

  return result;
}

var deserialize3 = function(encoded, items) {
  var rawJson = atob(encoded)
  var json = JSON.parse(rawJson)
  
  var result = {
    crafting: json.c.map(craft => {
      return {
        enabled: craft.e,
        size: craft.s,
        goals: craft.g.map(g => items[g]),
        inventory: craft.i.map(i => items[i])
      }
    }),
    options: {
      one_character_only: json.o.o,
      score_search_lengths: json.o.l,
      search: json.o.s,
      auto_search: json.o.as,
      letter_penalty: json.o.lp,
      junk_penalty: json.o.jp,
      fail_penalty: json.o.fp 
    }
  }

  return result;
}

var shareSerialize = function (data, items) {
  var shareObject = {
    c: data.crafting.map(function (craft) {
      return { 
        e: craft.enabled, 
        s: craft.size, 
        g: craft.goals.map(g => items.indexOf(g)), 
        i: craft.inventory.map(i => items.indexOf(i))
      }
    }),
    o: {
      o: data.options.one_character_only,
      l: data.options.score_search_lengths,
      s: data.options.search,
      as: data.options.auto_search,
      lp: data.options.letter_penalty,
      jp: data.options.junk_penalty,
      fp: data.options.fail_penalty,
    }
  }

  var json = JSON.stringify(shareObject);
  console.log(json);
  var encoded = btoa(json);

  return encoded;
}

var shareDeserialize = function (encoded, items) {
  var deserialized = null;
  try {
    deserialized = deserialize3(encoded, items)
  } catch (e3) {
    try {
      deserialized = deserialize2(encoded, items)
    } catch (e2) {
      try {
        deserialized = deserialize1(encoded, items)
      } catch (e1) {
        console.log("could not deserialize")
      }  
    }
  }

  return deserialized;
}

export const ShareSerialize = shareSerialize;
export const ShareDeserialize = shareDeserialize;

