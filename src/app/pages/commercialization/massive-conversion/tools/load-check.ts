import { type FormGroup } from '@angular/forms';
import {
  convertFormatDate,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import { type CapturelineService } from 'src/app/core/services/ms-captureline/captureline.service';

export function loadCheckLc(
  form: FormGroup,
  capturelineService: CapturelineService,
  cbOpenCheckPortal: (item: any) => void
) {
  const { validityDate, eventId } = form.getRawValue();
  let p_FLAG = Boolean(validityDate);
  console.log(form.getRawValue());
  showQuestion({
    text: validityDate
      ? `La fecha de vigencia será ${convertFormatDate(
          validityDate
        )}. ¿Desea continuar?`
      : 'La Fecha de vigencia se tomará de la tabla. ¿Desea continuar?',
    title: 'Confirmación',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  }).then((res: any) => {
    if (res.isConfirmed) {
      capturelineService
        .postLoadCheckPortal({
          event: eventId,
          validation: validityDate ? convertFormatDate(validityDate) : '',
          p_FLAG,
        })
        .subscribe({
          next: res => {
            showToast({
              text: 'Se cargaron los checks correctamente',
              icon: 'success',
            });
            console.log(res);
            if (res.data.length === 0) {
              showToast({
                text: 'No se encontraron checks',
                title: 'Advertencia',
                icon: 'warning',
              });
              return;
            }
            cbOpenCheckPortal({ list: res.data });
          },
          error: () => {
            showToast({
              text: 'Ocurrió un error al cargar los checks',
              icon: 'error',
            });
          },
        });
    }
  });
  // .catch(() => {
  //   return reject();
  // });
  // });
}

function getSequenceOperation() {}

function loadCheck() {}
