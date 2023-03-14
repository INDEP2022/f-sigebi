import { environment } from 'src/environments/environment';
import Swal, { type SweetAlertOptions } from 'sweetalert2';

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

export function showToast({ ...data }: SwalOptions): void {
  Swal.fire({
    icon: 'success',
    toast: true,
    position: 'top-end',
    timer: 6000,
    showConfirmButton: false,
    showCancelButton: false,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    showCloseButton: false,
    buttonsStyling: false,
    ...data,
  });
}
