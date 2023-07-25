import InvalidPhone from '../errors/invalid-phone';

const MIN_LENGTH = 10;
const MAX_LENGTH = 13;
const PHONE_WITHOUT_COUNTRY_CODE_LENGTH = 11;
const DEFAULT_COUNTRY_CODE = '55';

const removeMask = (rawString: string): string => {
  return rawString.replace(/[^0-9]/gi, '');
};

const isLengthValid = (sanitazedString: string): boolean => {
  if (sanitazedString === '') {
    return false;
  }
  return sanitazedString.length >= MIN_LENGTH && sanitazedString.length <= MAX_LENGTH;
};

const validate = (rawString: string): boolean => {
  const sanitazedString = removeMask(rawString);
  if (!isLengthValid(sanitazedString)) {
    return false;
  }

  return true;
};

class Phone {
  constructor(private readonly phone: string) {
    if (!validate(phone)) {
      throw new InvalidPhone();
    }
  }

  public getValue(): string {
    let sanitazedString = removeMask(this.phone);
    if (sanitazedString.length <= PHONE_WITHOUT_COUNTRY_CODE_LENGTH) {
      sanitazedString = `${DEFAULT_COUNTRY_CODE}${sanitazedString}`;
    }

    const countryCode = sanitazedString.substring(0, 2);
    const areaCode = sanitazedString.substring(2, 4);
    const phone = sanitazedString.substring(4);
    const isPhoneOddLength = phone.length % 2 !== 0;
    const phoneIndexToFormat = isPhoneOddLength ? Math.ceil(phone.length / 2) : phone.length / 2;
    return `+${countryCode} ${areaCode} ${phone.substring(0, phoneIndexToFormat)}-${phone.substring(
      phoneIndexToFormat,
    )}`;
  }
}

export default Phone;
