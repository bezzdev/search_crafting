var languages = [
  { name: 'Af-Soomaali', region: 'Soomaaliya', key: 'so_so', localized: 'Somali language', warning: null },
  { name: 'Afrikaans', region: 'Suid-Afrika', key: 'af_za', localized: 'Afrikaans', warning: null },
  { name: 'Andalûh', region: 'Andaluçía', key: 'esan', localized: 'Andalûh', warning: null },
  { name: 'Anglish', region: 'Foroned Kingdom', key: 'enp', localized: 'Anglish', warning: null },
  { name: 'Asturianu', region: 'Asturies', key: 'ast_es', localized: 'Asturian', warning: null },
  { name: 'Azərbaycanca', region: 'Azərbaycan', key: 'az_az', localized: 'Azerbaijani', warning: null },
  { name: 'Bahasa Indonesia', region: 'Indonesia', key: 'id_id', localized: 'Indonesian', warning: null },
  { name: 'Bahasa Melayu', region: 'Malaysia', key: 'ms_my', localized: 'Malay', warning: null },
  { name: 'Boarisch', region: 'Bayern', key: 'bar', localized: 'Boaric', warning: null },
  { name: 'Bosanski', region: 'Bosna i Hercegovina', key: 'bs_ba', localized: 'Bosnian', warning: null },
  { name: 'Brabants', region: 'Nederland', key: 'brb', localized: 'Brabant', warning: null },
  { name: 'Brezhoneg', region: 'Breizh', key: 'br_fr', localized: 'Brezhoneg', warning: null },
  { name: 'Català (Valencià)', region: 'Comunitat Valenciana', key: 'val_es', localized: 'Valencian', warning: null },
  { name: 'Català', region: 'Catalunya', key: 'ca_es', localized: 'Catalan', warning: null },
  { name: 'Cymraeg', region: 'Cymru', key: 'cy_gb', localized: 'Welsh', warning: null },
  { name: 'Dansk', region: 'Danmark', key: 'da_dk', localized: 'Danish', warning: null },
  { name: 'Davvisámegiella', region: 'Sápmi', key: 'se_no', localized: 'Northern Sámi', warning: null },
  { name: 'Deitsch', region: 'Österreich', key: 'de_at', localized: 'Austrian German', warning: null },
  { name: 'Deutsch', region: 'Deutschland', key: 'de_de', localized: 'German', warning: null },
  { name: 'Eesti keel', region: 'Eesti', key: 'et_ee', localized: 'Estonian', warning: null },
  { name: 'English', region: 'Australia', key: 'en_au', localized: 'English', warning: null },
  { name: 'English', region: 'Canada', key: 'en_ca', localized: 'English', warning: null },
  { name: 'English', region: 'New Zealand', key: 'en_nz', localized: 'English', warning: null },
  { name: 'English', region: 'United Kingdom', key: 'en_gb', localized: 'English', warning: null },
  { name: 'English', region: 'United States', key: 'en_us', localized: 'English', warning: null },
  { name: 'Español', region: 'Argentina', key: 'es_ar', localized: 'Spanish', warning: null },
  { name: 'Español', region: 'Chile', key: 'es_cl', localized: 'Spanish', warning: null },
  { name: 'Español', region: 'Ecuador', key: 'es_ec', localized: 'Spanish', warning: null },
  { name: 'Español', region: 'España', key: 'es_es', localized: 'Spanish', warning: null },
  { name: 'Español', region: 'México', key: 'es_mx', localized: 'Spanish', warning: null },
  { name: 'Español', region: 'Uruguay', key: 'es_uy', localized: 'Spanish', warning: null },
  { name: 'Español', region: 'Venezuela', key: 'es_ve', localized: 'Spanish', warning: null },
  { name: 'Esperanto', region: 'Esperantujo', key: 'eo_uy', localized: 'Esperanto', warning: null },
  { name: 'Euskara', region: 'Euskal Herria', key: 'eu_es', localized: 'Basque', warning: null },
  { name: 'Filipino', region: 'Pilipinas', key: 'fil_ph', localized: 'Filipino', warning: null },
  { name: 'Føroyskt', region: 'Føroyar', key: 'fo_fo', localized: 'Føroysk', warning: null },
  { name: 'Français', region: 'Canada', key: 'fr_ca', localized: 'French', warning: null },
  { name: 'Français', region: 'France', key: 'fr_fr', localized: 'French', warning: null },
  { name: 'Fränggisch', region: 'Franggn', key: 'fra_de', localized: 'Franggian', warning: null },
  { name: 'Frysk', region: 'Fryslân', key: 'fy_nl', localized: 'Frisian', warning: null },
  { name: 'Gaeilge', region: 'Éire', key: 'ga_ie', localized: 'Irish Gaelic', warning: null },
  { name: 'Gaelg', region: 'Ellan Vannin', key: 'gv_im', localized: 'Manx Gaelic', warning: null },
  { name: 'Gàidhlig', region: 'Alba', key: 'gd_gb', localized: 'Scottish Gaelic', warning: null },
  { name: 'Galego', region: 'Galicia / Galiza', key: 'gl_es', localized: 'Galician', warning: null },
  { name: 'Hrvatski', region: 'Hrvatska', key: 'hr_hr', localized: 'Croatian', warning: null },
  { name: 'Ido', region: 'Idia', key: 'io_en', localized: 'Ido', warning: null },
  { name: 'Igbo', region: 'Nigeria', key: 'ig_ng', localized: 'Igbo', warning: null },
  { name: 'Íslenska', region: 'Ísland', key: 'is_is', localized: 'Icelandic', warning: null },
  { name: 'Italiano', region: 'Italia', key: 'it_it', localized: 'Italian', warning: null },
  { name: 'Kernewek', region: 'Kernow', key: 'kw_gb', localized: 'Cornish', warning: null },
  { name: 'Kölsch/Ripoarisch', region: 'Rhingland', key: 'ksh', localized: 'Ripuarian', warning: null },
  { name: 'LOLCAT', region: 'Kingdom of Cats', key: 'lol_us', localized: 'LOLCAT', warning: null },
  { name: 'Latina', region: 'Latium', key: 'la_la', localized: 'Latina', warning: null },
  { name: 'Latviešu', region: 'Latvija', key: 'lv_lv', localized: 'Latvian', warning: null },
  { name: 'Lëtzebuergesch', region: 'Lëtzebuerg', key: 'lb_lu', localized: 'Luxembourgish', warning: null },
  { name: 'Lietuvių', region: 'Lietuva', key: 'lt_lt', localized: 'Lithuanians', warning: null },
  { name: 'Limburgs', region: 'Limburg', key: 'li_li', localized: 'Limburgish', warning: null },
  { name: 'Lombard', region: 'Lombardia', key: 'lmo', localized: 'Lombard', warning: null },
  { name: 'Magyar', region: 'Magyarország', key: 'hu_hu', localized: 'Hungarian', warning: null },
  { name: 'Malti', region: 'Malta', key: 'mt_mt', localized: 'Maltese', warning: null },
  { name: 'Medžuslovjansky', region: 'Slovjanščina', key: 'isv', localized: 'Interslavic', warning: null },
  { name: 'Nederlands', region: 'Nederland', key: 'nl_nl', localized: 'Dutch', warning: null },
  { name: 'Norsk bokmål', region: 'Norge', key: 'no_no', localized: 'Bokmål Norwegian', warning: null },
  { name: 'Norsk nynorsk', region: 'Noreg', key: 'nn_no', localized: 'New Norwegian', warning: null },
  { name: 'Occitan', region: 'Occitània', key: 'oc_fr', localized: 'Occense', warning: null },
  { name: 'Oschdallgaiarisch', region: 'Allgai', key: 'swg', localized: 'Oschdallgaiarian', warning: null },
  { name: 'Övdalska', region: 'Swerre', key: 'ovd', localized: 'Elfdalian', warning: null },
  { name: 'Pirate Speak', region: 'The Seven Seas', key: 'en_pt', localized: 'Pirate Speak', warning: null },
  { name: 'Plattdüütsch', region: 'Düütschland', key: 'nds_de', localized: 'Low German', warning: null },
  { name: 'Polski', region: 'Polska', key: 'pl_pl', localized: 'Polish', warning: null },
  { name: 'Português', region: 'Brasil', key: 'pt_br', localized: 'Portuguese', warning: null },
  { name: 'Português', region: 'Portugal', key: 'pt_pt', localized: 'Portuguese', warning: null },
  { name: 'Quenya', region: 'Arda', key: 'qya_aa', localized: 'Elvish', warning: null },
  { name: 'Română', region: 'România', key: 'ro_ro', localized: 'Romanian ', warning: null },
  { name: 'Säggs\'sch', region: 'Saggsn', key: 'sxu', localized: 'Upper Saxon German', warning: null },
  { name: 'Schwiizerdütsch', region: 'Schwiz', key: 'de_ch', localized: 'Swiss German', warning: null },
  { name: 'Shakespearean English', region: 'Kingdom of England', key: 'enws', localized: 'Shakespearean English', warning: null },
  { name: 'Shqip', region: 'Shqipëri', key: 'sq_al', localized: 'Albanian', warning: null },
  { name: 'Slovenčina', region: 'Slovensko', key: 'sk_sk', localized: 'Slovak', warning: null },
  { name: 'Slovenščina', region: 'Slovenija', key: 'sl_si', localized: 'Slovenian', warning: null },
  { name: 'Suomi', region: 'Suomi', key: 'fi_fi', localized: 'Finnish', warning: null },
  { name: 'Svenska', region: 'Sverige', key: 'sv_se', localized: 'Swedish', warning: null },
  { name: 'Tagalog', region: 'Pilipinas', key: 'tl_ph', localized: 'Tagalog', warning: null },
  { name: 'Te Reo Māori', region: 'Aotearoa', key: 'mi_nz', localized: 'Māori', warning: null },
  { name: 'Tiếng Việt', region: 'Việt Nam', key: 'vi_vn', localized: 'Vietnamese', warning: null },
  { name: 'Türkçe', region: 'Türkiye', key: 'tr_tr', localized: 'Turkish', warning: null },
  { name: 'Vèneto', region: 'Veneto', key: 'vec_it', localized: 'Venetian', warning: null },
  { name: 'Vlaams', region: 'België', key: 'nl_be', localized: 'Dutch (Belgium)', warning: null },
  { name: 'Yorùbá', region: 'Nàìjíríà', key: 'yo_ng', localized: 'Yoruba', warning: null },
  { name: 'la .lojban.', region: 'la jbogu\'e', key: 'jbo_en', localized: 'Lojban', warning: null },
  { name: 'tlhIngan Hol', region: 'tlhIngan wo\'', key: 'tlh_aa', localized: 'Klingon', warning: null },
  { name: 'Čeština', region: 'Česko', key: 'cs_cz', localized: 'Czech', warning: null },
  { name: 'Ślōnskŏ', region: 'Gōrny Ślōnsk', key: 'szl', localized: 'Silesian', warning: null },
  { name: 'ɥsᴉꞁᵷuƎ', region: 'uʍoᗡ ǝpᴉsd∩', key: 'en_ud', localized: 'Upside Down', warning: null },
  { name: '文言', region: '華夏', key: 'lzh', localized: 'Classical Chinese', warning: "Multiple keystrokes may be required to type a single character in this language." },
  { name: 'ʻŌlelo Hawaiʻi', region: 'Hawaiʻi', key: 'haw_us', localized: 'Hawaiian', warning: null },
  { name: '日本語', region: '日本', key: 'ja_jp', localized: 'Japanese', warning: "Multiple keystrokes may be required to type a single character in this language." },
  { name: '한국어', region: '대한민국', key: 'ko_kr', localized: 'korean', warning: "Multiple keystrokes may be required to type a single character in this language." },
  { name: 'ไทย', region: 'ประเทศไทย', key: 'th_th', localized: 'Thai', warning: null },
  { name: '简体中文', region: '中国', key: 'zh_cn', localized: 'Chinese (PRC)', warning: "Multiple keystrokes may be required to type a single character in this language." },
  { name: '繁體中文', region: '香港', key: 'zh_hk', localized: 'Chinese (Hong Kong)', warning: "Multiple keystrokes may be required to type a single character in this language." },
  { name: '繁體中文', region: '台灣', key: 'zh_tw', localized: 'Chinese (Taiwan)', warning: "Multiple keystrokes may be required to type a single character in this language." },
  { name: 'हिंदी', region: 'भारत', key: 'hi_in', localized: 'Hindi', warning: null },
  { name: 'ಕನ್ನಡ', region: 'ಭಾರತ', key: 'kn_in', localized: 'Kannada', warning: null },
  { name: 'فارسی', region: 'ايران', key: 'fa_ir', localized: 'Farsi', warning: "This language may not work in game." },
  { name: 'עברית', region: 'ישראל', key: 'he_il', localized: 'Hebrew', warning: null },
  { name: 'தமிழ்', region: 'இந்தியா', key: 'ta_in', localized: 'Tamil', warning: null },
  { name: 'Српски', region: 'Србија', key: 'sr_sp', localized: 'Serbian', warning: null },
  { name: 'Монгол', region: 'Монгол Улс', key: 'mn_mn', localized: 'Mongolian', warning: null },
  { name: 'ייִדיש', region: 'אשכנזישע יידן', key: 'yi_de', localized: 'Yiddish', warning: null },
  { name: 'Татарча', region: 'Рәсәй', key: 'tt_ru', localized: 'Tatar', warning: null },
  { name: 'Русский', region: 'Россия', key: 'ru_ru', localized: 'Russian', warning: null },
  { name: 'العربية', region: 'العالم العربي', key: 'ar_sa', localized: 'Arabic', warning: null },
  { name: 'Հայերեն', region: 'Հայաստան', key: 'hy_am', localized: 'Armenian', warning: null },
  { name: 'Қазақша', region: 'Қазақстан', key: 'kk_kz', localized: 'Kazakh', warning: null },
  { name: 'ქართული', region: 'საქართველო', key: 'ka_ge', localized: 'Georgian', warning: null },
  { name: 'Ελληνικά', region: 'Ελλάδα', key: 'el_gr', localized: 'Greek', warning: null },
  { name: 'Башҡортса', region: 'Рәсәй', key: 'ba_ru', localized: 'Bashkir', warning: null },
  { name: 'Български', region: 'България', key: 'bg_bg', localized: 'Bulgarian', warning: null },
  { name: 'Українська', region: 'Україна', key: 'uk_ua', localized: 'Ukrainian', warning: null },
  { name: 'Беларуская', region: 'Беларусь', key: 'be_by', localized: 'Belarusian', warning: null },
  { name: 'Македонски', region: 'Македонија', key: 'mk_mk', localized: 'Macedonian', warning: null },
  { name: 'Дореформенный русскій', region: 'Русь', key: 'rpr', localized: 'Pre-reform Russian', warning: null },
]
export const Languages = languages;