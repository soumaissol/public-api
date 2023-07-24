import Phone from '../../../../src/domain/entity/phone';
import InvalidPhone from '../../../../src/domain/errors/invalid-phone';

describe('Test Phone', () => {
  it('should throw error when phone is only text', () => {
    try {
      const phone = new Phone('celular');
      expect(phone.getValue()).toBeNull();
    } catch (err) {
      expect(err).toEqual(new InvalidPhone());
    }
  });

  it('should throw error when phone is too short', () => {
    try {
      const phone = new Phone('1234567');
      expect(phone.getValue()).toBeNull();
    } catch (err) {
      expect(err).toEqual(new InvalidPhone());
    }
  });

  it('should throw error when phone is too long', () => {
    try {
      const phone = new Phone('+555 111 12345678');
      expect(phone.getValue()).toBeNull();
    } catch (err) {
      expect(err).toEqual(new InvalidPhone());
    }
  });

  it('should return formated phone when phone is small without countrycode', () => {
    const phone = new Phone('1112345678');
    expect(phone.getValue()).toBe('+55 11 1234-5678');
  });

  it('should return formated phone when phone is small with countrycode', () => {
    const phone = new Phone('221112345678');
    expect(phone.getValue()).toBe('+22 11 1234-5678');
  });

  it('should return formated phone when phone is long without countrycode', () => {
    const phone = new Phone('11123456789');
    expect(phone.getValue()).toBe('+55 11 12345-6789');
  });

  it('should return formated phone when phone is long with countrycode', () => {
    const phone = new Phone('2211123456789');
    expect(phone.getValue()).toBe('+22 11 12345-6789');
  });

});
