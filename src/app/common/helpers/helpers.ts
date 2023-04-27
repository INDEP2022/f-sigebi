import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertResult, type SweetAlertOptions } from 'sweetalert2';

type SwalOptions = Partial<SweetAlertOptions> & Required<{ text: string }>;

/**
 * @param {string} pathReport - Path del reporte ejem: 'SIAB/RCONCOGVOLANTESRE'
 * @param {{ [key: string]: string }} params - Parametros del reporte ejem: { PN_VOLANTEFIN: '70646', user_id: '0' }
 * @param {string} [ext='.pdf'] - Extension del reporte ejem: '.pdf'
 **/
export function downloadReport(
  pathReport: string,
  params?: { [key: string]: string },
  ext = '.pdf'
): void {
  let url = `${environment.API_REPORTS}${pathReport}${ext}`;
  if (params) {
    const paramsString = new URLSearchParams(params).toString();
    url += `?${paramsString}`;
  }
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.target = '_blank';
  downloadLink.click();
  showToast({
    title: 'Reporte generado',
    text: 'El reporte se descargará en unos segundos',
  });
}

export function showToast(
  data: SwalOptions | string
): Promise<SweetAlertResult<any>> {
  if (typeof data === 'string') data = { text: data } as SwalOptions;

  const toast = Swal.mixin({
    icon: 'success',
    toast: true,
    position: 'top-end',
    timer: 6000,
    showCloseButton: true,
    buttonsStyling: false,
    showConfirmButton: false,
    timerProgressBar: true,
    ...data,
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  return toast.fire();
}

export function showAlert<T = any>({
  ...data
}: SwalOptions): Promise<SweetAlertResult<T>> {
  return Swal.fire({ icon: 'success', position: 'center', ...data });
}

type SwalQuestionType = {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: boolean;
  dismiss?: string;
};

export function showQuestion({
  ...data
}: SwalOptions): Promise<SweetAlertResult<SwalQuestionType>> {
  return showAlert({
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Si, eliminar',
    cancelButtonText: 'No, cancelar',
    ...data,
  });
}

export function convertFormatDate(
  date: any,
  format = 'yyyy-MM-dd',
  lang = 'en'
): any {
  return formatDate(new Date(date), format, lang);
}

export function readFile(
  file: File,
  type: 'BinaryString' | 'ArrayBuffer' | 'Text' | 'DataUrl' = 'Text'
): Promise<{ result: any; ext: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve({
        result: event.target.result,
        ext: file?.name.split('.').pop(),
      });
    };
    reader.onerror = error => reject(error);
    const functionType = `readAs${type}` as
      | 'readAsBinaryString'
      | 'readAsArrayBuffer'
      | 'readAsText'
      | 'readAsDataURL';
    reader[functionType](file);
  });
}

export function getUser() {
  return localStorage.getItem('username');
}

export function generateUrlOrPath(
  microservice: string,
  route: string,
  isPath = false
) {
  const url = environment.API_URL;
  const prefix = environment.URL_PREFIX;
  if (isPath) {
    return `${microservice}/${prefix}${route}`;
  }
  return `${url}${microservice}/${prefix}${route}`;
}
