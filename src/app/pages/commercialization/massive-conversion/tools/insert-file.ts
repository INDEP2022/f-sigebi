import {
  readFile,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import { type ExcelService } from 'src/app/common/services/excel.service';

export function insertFile(
  //   eventId: number,
  event: any,
  type: 'rfc' | 'client_id',
  excelService: ExcelService
) {
  showQuestion({
    text: `¿Está seguro de que desea insertar el archivo por ${type}?`,
    title: 'Insertar archivo',
    confirmButtonText: 'Si, insertar',
    cancelButtonText: 'No, cancelar',
    icon: 'question',
  }).then(result => {
    if (result.isConfirmed) {
      getDataCsvOrExcel(event, excelService, type)?.then(data => {
        console.log({ data, type });
      });
    }
  });
}

function getDataCsvOrExcel(event: any, excelService: ExcelService, type: any) {
  const files = (event.target as HTMLInputElement).files;
  if (files.length != 1) {
    showToast({
      text: 'No seleccionó ningún archivo o seleccionó más de la cantidad permitida (1)',
      icon: 'error',
    });
    return null;
  }
  return new Promise((resolve, reject) => {
    readFile(files[0], 'BinaryString').then(dataExcelString => {
      try {
        const dataExcel = excelService.getData(dataExcelString.result);
        console.log({ dataExcel });
        if (dataExcel.length == 0) {
          showToast({
            text: 'El archivo no contiene datos',
            icon: 'error',
          });
          reject(null);
          return;
        }
        if (!isValidHeaderExcelOrCvs(dataExcel[0], type)) {
          return;
        }

        console.log({ dataExcel });
        resolve(dataExcel);
        return;
        // alert('TODO: insertar en la temporal por que tiene que se masivamente');
      } catch (error) {
        console.error(error);
        showToast({
          text: 'Error al leer el archivo',
          icon: 'error',
        });
        reject(null);
        return;
      }
    });
  });
}

function isValidHeaderExcelOrCvs(
  data: { [key: string]: string },
  type: 'rfc' | 'client_id'
): boolean {
  const header = [
    'PALETAID',
    'LOTE',
    'MONTO_IN',
    'NO_CHEQUE_IN',
    'EXP_CHEQUE_IN',
    'FECVIGENCIA_IN',
  ];
  if (type === 'rfc') {
    header.push('RFC');
    header.push('EVENTO');
  } else if (type === 'client_id') {
    header.push('CLIENTEID');
  }
  return header.every((item: any) => {
    if (!data[0].hasOwnProperty(item)) {
      showToast({
        icon: 'error',
        text: 'El archivo no contiene la columna ' + item,
        title: 'Error',
      });
      return true;
    }
    return false;
  });
}
