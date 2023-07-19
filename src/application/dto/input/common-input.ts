
import * as jf from 'joiful';

import InvalidInput from '../../errors/invalid-input';
import EmptyInput from '../../errors/empty-input';

function convertAndValidateInput<TData>(data: any, input: TData | null): TData {
  if (data === null || input === null) {
    throw new EmptyInput();
  }
  const { error } = jf.validate(input);
  if (error?.message) {
    throw new InvalidInput(error.message, 'validation_error');
  }
  return input;
}

function safelyParseData(data: any): any {
  if (data === null) {
    return {};
  }
  try {
    return JSON.parse(data || '{}');
  } catch (err) {
    return {};
  }
}

export { convertAndValidateInput, safelyParseData };
