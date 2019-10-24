import React from 'react';
import { FormattedMessage } from 'react-intl';

export const EnumErrorLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const ErrorLevelValues = {
  [EnumErrorLevel.INFO]: 0,
  [EnumErrorLevel.WARN]: 1,
  [EnumErrorLevel.ERROR]: 2,
};

export class ServerError extends Error {

  constructor(errors) {
    super(errors[0].description || '');

    this.code = errors[0].code;
    this.name = 'ServerError';
    this.errors = errors;
    this.level = errors.reduce((level, err) => {
      if (Object.keys(ErrorLevelValues).includes(err.level)) {
        return (ErrorLevelValues[level] < ErrorLevelValues[err.level] ? err.level : level);
      }
      return EnumErrorLevel.ERROR;
    }, EnumErrorLevel.INFO);
  }
}

function resolveReason(reason) {
  switch (reason) {
    case 'Email':
    case 'NotBlank':
    case 'NotEmpty':
    case 'Size':
      return reason;
    default:
      return 'Default';
  }
}

function resolveValues(fieldMapper, fieldName, reason, args = []) {
  const field = fieldMapper(fieldName);

  switch (reason) {
    case 'Size':
      return {
        field,
        min: args[1],
        max: args[0],
      };
    default:
      return {
        field,
      };
  }
}

export function formatErrors(errors, fieldMapper) {
  return (
    <React.Fragment>
      {errors
        .filter(e => e.code == 'BasicErrorCode.VALIDATION_ERROR')
        .map((e, index) => {
          return (
            <p key={`error-${index}`}>
              <FormattedMessage
                id={`error.validation.${resolveReason(e.reason)}`}
                values={resolveValues(fieldMapper, e.description, e.reason, e.arguments)}
              />
            </p>
          );
        })}
      {errors.some(e => e.code != 'BasicErrorCode.VALIDATION_ERROR') &&
        <FormattedMessage key="error-generic" id={`error.generic`} />
      }
    </React.Fragment>
  );
}
