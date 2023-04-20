import { type FormGroup } from '@angular/forms';
import {
  convertFormatDate,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import { type CapturelineService } from 'src/app/core/services/ms-captureline/captureline.service';

export function loadCheckLc(
  form: FormGroup,
  capturelineService: CapturelineService
) {
  if (form.invalid) {
    showToast({
      text: 'No se ha insertado ningún filtro de búsqueda.',
      title: 'Advertencia',
      icon: 'warning',
    });
    form.markAllAsTouched();
    return;
  }
  const { validityDate, eventId } = form.getRawValue();
  let p_FLAG = Boolean(validityDate);

  showQuestion({
    text: validityDate
      ? `La fecha de vigencia será ${convertFormatDate(
          validityDate
        )}. ¿Desea continuar?`
      : 'La Fecha de vigencia se tomará de la tabla. ¿Desea continuar?',
  }).then((res: any) => {
    if (res.isConfirmed) {
      capturelineService
        .postLoadCheckPortal({
          event: eventId,
          validation: convertFormatDate(validityDate),
          p_FLAG,
        })
        .subscribe({
          next: res => {
            showToast({
              text: 'Se cargaron los checks correctamente',
              icon: 'success',
            });
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
