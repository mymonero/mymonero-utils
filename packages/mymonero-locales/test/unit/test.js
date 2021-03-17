/* eslint-env mocha */

var assert = require('assert')
var locales = require('../../index')

describe('MyMonero Locales', function () {
  describe('#supportedShortCodes', function () {
    it('should return list of supported short codes', function () {
      assert.deepStrictEqual([
        'en',
        'nl',
        'fr',
        'es',
        'pt',
        'ja',
        'it',
        'de',
        'ru',
        'zh',
        'eo',
        'jbo'
      ], locales.supportedShortCodes)
    })
  })

  describe('#smnemonicLanguages', function () {
    it('should return list of supported mnemonic languages', function () {
      assert.deepStrictEqual([
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
        'Lojban'], locales.mnemonicLanguages)
    })
  })

  describe('#compatibleCodeFromLocale()', function () {
    it('should return short code if supported', function () {
      assert.strictEqual('ru', locales.compatibleCodeFromLocale('ru'))
    })
    it('should return null if not supported', function () {
      assert.strictEqual(null, locales.compatibleCodeFromLocale('xx'))
    })
  })
})
