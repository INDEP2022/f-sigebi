import { showQuestion } from 'src/app/common/helpers/helpers';

export function deletePeriodFn(period: any, typeProcess: number) {
  showQuestion({
    text: `Está seguro de eliminar la carga del periodo ${period}`,
  }).then(result => {
    if (result.isConfirmed) {
      processFn(typeProcess);
    }
  });
}

function processFn(typeProcess: number) {}
