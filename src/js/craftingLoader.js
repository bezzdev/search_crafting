var craftingLoader = function (crafting) {
  crafting.forEach(function (craft) {
    if (!checkProperty(craft, 'enabled'))
      craft.enabled = true;
    if (!checkProperty(craft, 'size'))
      craft.size = 3;
    if (!checkProperty(craft, 'weight'))
      craft.weight = 1.0;
    if (!checkProperty(craft, 'goals'))
      craft.goals = [];
    if (!checkProperty(craft, 'inventory'))
      craft.inventory = [];
  })
  return crafting;
}

var checkProperty = function(obj, prop) {
  if ((prop in obj) == false || obj[prop] == undefined)
    return false;
  return true;
}

export const CraftingLoader = craftingLoader;

