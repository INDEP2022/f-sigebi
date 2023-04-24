import { readFile, showToast } from 'src/app/common/helpers/helpers';
import { ExcelService } from 'src/app/common/services/excel.service';

export function readFileClientIdOrRfc(
  eventId: number,
  event: any,
  type: 'rfc' | 'client_id',
  excelService: ExcelService
): void {
  if (!eventId) {
    showToast({
      icon: 'info',
      text: 'Seleccione un evento',
    });
    return;
  }

  const files = (event.target as HTMLInputElement).files;
  if (files.length != 1) {
    showToast({
      text: 'No seleccionó ningún archivo o seleccionó más de la cantidad permitida (1)',
      icon: 'error',
    });
  }

  readFile(files[0], 'BinaryString').then(res => {
    console.log({ res });
    try {
      const dataExcel = excelService.getData(res.result);
      console.log({ dataExcel });
      if (dataExcel.length == 0) {
        showToast({
          text: 'El archivo no contiene datos',
          icon: 'error',
        });
        return;
      }
      if (!isValidHeaderExcelOrCvs(dataExcel[0], type)) {
        return;
      }

      /* TODO: insertar en la temporal por que tiene que se masivamente */
      // this.insertTmpLcComer(data[0])
      console.log({ dataExcel });
      alert('TODO: insertar en la temporal por que tiene que se masivamente');
    } catch (error) {
      console.error(error);
      showToast({
        text: 'Error al leer el archivo',
        icon: 'error',
      });
    }
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
