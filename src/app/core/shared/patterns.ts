/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

export const EMAIL_PATTERN = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
export const NUMBERS_PATTERN = '^-?[0-9]+$';
export const NUMBERS_POINT_PATTERN = '^[0-9.]+';
export const POSITVE_NUMBERS_PATTERN = '^[0-9]+';
export const DOUBLE_PATTERN = '[+-]?([0-9]*[.])?[0-9]+';
export const STRING_PATTERN =
  '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\/\\s\\.,_\\-\\\\()$\\Üü“”;:]*';
// '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]
// export const RFCCURP_PATTERN = '[a-zA-Z]{3}[a-zA-Z0-9]*';
export const RFC_PATTERN = '^[A-Za-z]{3,4}[0-9]{6}[a-zA-Z0-9]{3}$';
export const CURP_PATTERN =
  '[a-zA-Z]{4}[0-9]{6}[h-mH-M]{1}[a-zA-Z]{5}[a-zA-Z0-9]{1}[0-9]{1}';
export const PHONE_PATTERN = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$';
export const KEYGENERATION_PATTERN = '[a-zA-Z0-9\\s\\-\\/]*';
export const NAME_PATTERN = '^[A-Za-z\\áéíóúÁÉÍÓÚñÑ\\ \\.]+$';

export const NUMBERS_BY_COMMA = '^(d+,?)+$';

//'^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$'
export const SPECIAL_STRING_PATTERN =
  '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\/\\s\\.,_\\-\\\\()\\Üü“”;:]*';
export const NUM_POSITIVE_LETTERS = '^[0-9]+|[a-zA-Z]+$';
export const NUM_POSITIVE = '^[0-9]+';

export const VALID_VALUE_REGEXP = (
  value: string,
  pattern: string | RegExp,
  maxLength: number,
  nameField?: string
) => {
  let validValue = '';
  let errorRegExp = false;
  let errorMaxLength = false;
  let regExp = new RegExp(pattern);
  for (let index = 0; index < maxLength; index++) {
    const element = value[index];
    if (element) {
      if (regExp.test(element)) {
        validValue = validValue + element;
      } else {
        errorRegExp = true;
      }
    }
  }
  if (value.length > maxLength) {
    errorMaxLength = true;
  }
  return {
    validValue: validValue,
    errorRegExp: errorRegExp,
    errorRegExpMessage: ERROR_REG_EXP(nameField),
    errorMaxLength: errorMaxLength,
    errorMaxLengthMessage: ERROR_MAX_LENGTH(nameField),
  };
};
const ERROR_REG_EXP = (nameField: string = '') =>
  `El campo${
    nameField ? ': ' + nameField + ',' : ''
  } tiene caracteres incorrectos los cuales se eliminaron.`;
const ERROR_MAX_LENGTH = (nameField: string = '') =>
  `El campo${
    nameField ? ': ' + nameField + ',' : ''
  } tiene MÁS caracteres de los permitidos, se eliminaron los caracteres después de la longitud permitida.`;
