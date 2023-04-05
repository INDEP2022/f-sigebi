/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

export const EMAIL_PATTERN = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
export const NUMBERS_PATTERN = '^-?[0-9]+$';
export const DOUBLE_PATTERN = '[+-]?([0-9]*[.])?[0-9]+';
export const STRING_PATTERN =
  '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\/\\s\\#$%¡!|*\\.,_\\-\\\\()\\Üü“”;:]*';
// '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]
export const RFCCURP_PATTERN = '[a-zA-Z]{3}[a-zA-Z0-9]*';
export const CURP_PATTERN =
  '[a-zA-Z]{4}[0-9]{6}[h-mH-M]{1}[a-zA-Z]{5}[a-zA-Z0-9]{1}[0-9]{1}';
export const PHONE_PATTERN = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$';
export const KEYGENERATION_PATTERN = '[a-zA-Z0-9\\s\\-\\/]*';
export const NAME_PATTERN = '^[A-Za-z\\áéíóúÁÉÍÓÚñÑ\\ \\.]+$';

export const NUMBERS_BY_COMMA = '^(d+,?)+$';

//'^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$'

export const NUM_POSITIVE_LETTERS = '^[0-9]+|[a-zA-Z]+$';
export const NUM_POSITIVE = '^[0-9]+';
