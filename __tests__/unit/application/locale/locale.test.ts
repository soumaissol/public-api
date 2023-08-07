import CustomerLeadAlreadExists from '../../../../src/domain/errors/customer-lead-alread-exists';
import SalesAgentLeadAlreadExists from '../../../../src/domain/errors/sales-agent-lead-alread-exists';
import Locale from '../../../../src/locale/locale';

describe('Test Locale', () => {
  it('should return default current locale', () => {
    const locale = new Locale();

    expect(locale.getCurrentLocale()).toBe('en');
  });

  it('should return available locales', () => {
    const locale = new Locale();

    expect(locale.getLocales()).toEqual(['en', 'pt-br']);
  });

  it('should return new locale', () => {
    const locale = new Locale();
    locale.setLocale('pt-br');
    expect(locale.getCurrentLocale()).toBe('pt-br');
  });

  it('should return default locale when new locale in unavailable', () => {
    const locale = new Locale();
    locale.setLocale('en');
    locale.setLocale('rs');
    expect(locale.getCurrentLocale()).toBe('en');
  });

  it('should return new locale ignoring case', () => {
    const locale = new Locale();
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(locale.getCurrentLocale()).toBe('pt-br');
  });

  it('should return transalation', () => {
    const locale = new Locale();
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(locale.translate('invalid email')).toBe('e-mail inválido');
  });

  it('should return transalation with params', () => {
    const locale = new Locale();
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(locale.translate('sales agent not found for id %s', 'id-1')).toBe(
      'corretor não encontrado com o número id-1',
    );
  });

  it('should return error correctly', () => {
    const locale = new Locale();
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(new SalesAgentLeadAlreadExists(locale, 'id-1').message).toBe(
      'corretor já cadastrado com identificador id-1',
    );
  });

  it('should return error correctly 2', () => {
    const locale = new Locale();
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(new CustomerLeadAlreadExists(locale, 'id-2').message).toBe('orçamento já cadastrado para o cliente id-2');
  });
});
