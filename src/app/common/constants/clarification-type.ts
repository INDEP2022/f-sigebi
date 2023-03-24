interface IClarificationType {
  id: string;
  description: string;
  value: string;
}
export const ClarificationTypes: IClarificationType[] = [
  {
    id: '2',
    description: 'Improcedente',
    value: 'SOLICITAR_IMPROCEDENCIA',
  },
  {
    id: '1',
    description: 'Aclaraci&oacute;n',
    value: 'SOLICITAR_ACLARACION',
  },
];
