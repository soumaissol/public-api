import enMap from './languages-map/en';
import ptBrMap from './languages-map/pt-br';

export default class LanguageMap {
  private map: any;

  constructor(language: string) {
    switch (language) {
      case 'pt-br':
        this.map = ptBrMap;
        return;
    }

    this.map = enMap;
  }

  getTranslation(text: string): string {
    return this.map[text] || '';
  }
}
