import type { APIGatewayProxyEvent } from 'aws-lambda';

import Locale from '../../../locale/locale';

const buildLocaleFromEvent = (event: APIGatewayProxyEvent): Locale => {
  const locale = new Locale();
  if (event.headers['Accept-Language']) {
    locale.setLocale(event.headers['Accept-Language']);
  }

  return locale;
};

export { buildLocaleFromEvent };
