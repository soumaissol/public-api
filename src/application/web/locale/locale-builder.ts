import type { APIGatewayProxyEvent } from 'aws-lambda';

import Locale from '../../../locale/locale';

const buildLocaleFromEvent = (event: APIGatewayProxyEvent): Locale => {
  const locale = new Locale();
  if (event.headers['Accept-Language']) {
    const acceptLanguages = event.headers['Accept-Language'].split(',');
    locale.setLocale(acceptLanguages[0]);
  }

  return locale;
};

export { buildLocaleFromEvent };
