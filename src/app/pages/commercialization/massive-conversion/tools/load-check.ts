import { type Observable } from 'rxjs';
import { showQuestion, showToast } from 'src/app/common/helpers/helpers';

export function loadCheckLc(
  eventId: number,
  dateVigilance: any,
  callbackGetData: Observable<any>
): void {
  if (!eventId) {
    showToast({
      icon: 'info',
      text: 'Debe especificar el Evento.',
    });
    return;
  }

  let message = `La Fecha de vigencia se tomará de la tabla.`;
  let isBank = false;
  if (!dateVigilance) {
    message = `La Fecha de vigencia será ${dateVigilance}.`;
    isBank = true;
  }

  showQuestion({
    title: '¿Desea cargar el archivo?',
    text: message,
  }).then(({ isConfirmed }) => {
    if (!isConfirmed) {
      return;
    }
  });
}

function loadCheckPortal(eventId: number, flag: boolean) {}

function getSequenceOperation() {}

function loadCheck() {}
