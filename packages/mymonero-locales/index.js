'use strict'

const supportedShortCodes = [
  'en',
  'nl',
  'fr',
  'es',
  'pt',
  'ja',
  'it',
  'de',
  'ru',
  'zh', // chinese (simplified)
  'eo',
  'jbo' // Lojban
]

const mnemonicLanguages = [
  'English',
  'Netherlands',
  'Français',
  'Español',
  'Português',
  '日本語',
  'Italiano',
  'Deutsch',
  'русский язык',
  '简体中文 (中国)',
  'Esperanto',
  'Lojban'
]

exports.supportedShortCodes = supportedShortCodes
exports.mnemonicLanguages = mnemonicLanguages

exports.compatibleCodeFromLocale = function (localeString) {
  for (var i = 0; i < supportedShortCodes.length; i++) {
    if (localeString.indexOf(supportedShortCodes[i]) == 0) {
      return supportedShortCodes[i]
    }
  }
  return null
}
