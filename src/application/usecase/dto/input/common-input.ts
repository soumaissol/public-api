
import * as jf from 'joiful';

import InvalidInput from '../../../errors/invalid-input';
import EmptyInput from '../../../errors/empty-input';

function convertAndValidatInput<TData>(data: any, input: TData): TData {
  if (data === null) {
    throw new EmptyInput();
  }
  const { error } = jf.validate(input);
  if (error?.message) {
    throw new InvalidInput(error.message, 'validation_error');
  }
  return input;
}

export { convertAndValidatInput };
