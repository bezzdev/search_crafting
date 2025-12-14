var languageLoader = function (languages, all_languages) {
  if (!languages) {
    return [].concat(all_languages);
  }
  return languages.filter(lang => all_languages.includes(lang));
}


export const LanguageLoader = languageLoader;