import { Locale } from 'sms-api-commons';

import CustomerLeadAlreadExists from '../../../../src/domain/errors/customer-lead-alread-exists';
import SalesAgentLeadAlreadExists from '../../../../src/domain/errors/sales-agent-lead-alread-exists';
import CustomLocaleProvider from '../../../../src/locale/custom-locale-provider';

describe('Test Locale', () => {
  it('should return default current locale', () => {
    const locale = new Locale(new CustomLocaleProvider());

    expect(locale.getCurrentLocale()).toBe('en');
  });

  it('should return available locales', () => {
    const locale = new Locale(new CustomLocaleProvider());

    expect(locale.getLocales()).toEqual(['en', 'pt-br']);
  });

  it('should return new locale', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('pt-br');
    expect(locale.getCurrentLocale()).toBe('pt-br');
  });

  it('should return default locale when new locale in unavailable', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('en');
    locale.setLocale('rs');
    expect(locale.getCurrentLocale()).toBe('en');
  });

  it('should return new locale ignoring case', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(locale.getCurrentLocale()).toBe('pt-br');
  });

  it('should return transalation', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(locale.translate('invalid email')).toBe('e-mail inválido');
  });

  it('should return transalation with params', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(locale.translate('sales agent not found for email %s', 'email@email.com')).toBe(
      'Não foi possível localizar um corretor cadastrado com o e-mail email@email.com',
    );
  });

  it('should return error correctly', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(new SalesAgentLeadAlreadExists(locale, 'id-1').message).toBe(
      'O corretor já cadastrado com identificador id-1. Por favor, aguarde nosso contato',
    );
  });

  it('should return error correctly 2', () => {
    const locale = new Locale(new CustomLocaleProvider());
    locale.setLocale('en');
    locale.setLocale('PT-Br');
    expect(new CustomerLeadAlreadExists(locale, 'id-2').message).toBe(
      'O orçamento já cadastrado para o cliente id-2. Por favor, aguarde nosso contato',
    );
  });
});
