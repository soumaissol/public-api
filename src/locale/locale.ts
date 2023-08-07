import util from 'util';

import LanguageMap from './language-map';

export default class Locale {
  private currentLocale: string;
  private languageMap: LanguageMap;

  constructor() {
    this.currentLocale = 'en';
    this.languageMap = new LanguageMap(this.currentLocale);
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getLocales(): string[] {
    return ['en', 'pt-br'];
  }

  setLocale(newLocale: string): void {
    if (this.getLocales().indexOf(newLocale.toLowerCase().trim()) !== -1) {
      this.currentLocale = newLocale.toLowerCase().trim();
      this.languageMap = new LanguageMap(this.currentLocale);
    }
  }

  translate(text: string, args: any = undefined): string {
    if (args) {
      return util.format(this.languageMap.getTranslation(text), args);
    }
    return util.format(this.languageMap.getTranslation(text));
  }
}
