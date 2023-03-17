import { ITableField } from 'src/app/core/models/ms-audit/table-field.model';

export function generateColumnsFromFields(fields: ITableField[]) {
  let columns: any = {
    no_registro: {
      title: 'No Registro',
      sort: false,
    },
  };
  fields.forEach(field => {
    const columnName = field.column?.toLowerCase();
    const column = {
      [columnName]: {
        title: field.columnDescription,
        sort: false,
      },
    };
    columns = { ...columns, ...column };
  });
  return columns;
}
