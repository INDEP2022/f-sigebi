import { FormControl, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

export const GOOD_CAPTURE_FORM = {
  noPartida: new FormControl('', [Validators.required]),
  valorAvaluo: new FormControl('', [Validators.required]),
  capitulo: new FormControl('', [Validators.required]),
  partida: new FormControl('', [Validators.required]),
  subpartida: new FormControl('', [Validators.required]),
  ssubpartida: new FormControl('', [Validators.required]),
  noClasifBien: new FormControl<number>(null, [Validators.required]),
  type: new FormControl<string | number>(null, [Validators.required]),
  subtype: new FormControl<string | number>('', [Validators.required]),
  ssubtype: new FormControl<string | number>('', [Validators.required]),
  sssubtype: new FormControl<string | number>('', [Validators.required]),
  unidadLigie: new FormControl('', [Validators.required]),
  unidadMedida: new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]),
  cantidad: new FormControl<number>(null, [
    Validators.required,
    Validators.min(1),
  ]),
  destino: new FormControl(null, [Validators.required]),
  estadoConservacion: new FormControl(null, [Validators.required]),
  noBien: new FormControl(null, [Validators.required]),
  valRef: new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]),
  identifica: new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]),
  descripcion: new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]),
  fichaNumerario: new FormControl(null, [Validators.required]),
  captura: new FormControl('', [Validators.required]),
  cambioValor: new FormControl('', [Validators.required]),
  requery: new FormControl(null, [Validators.required]),
  satTipoExpediente: new FormControl(null, [Validators.required]),
  satIndicator: new FormControl(null, [Validators.required]),
  validFrac: new FormControl(null, [Validators.required]),
  almacen: new FormControl(false, [Validators.required]),
  entFed: new FormControl(null, [Validators.required]),
  municipio: new FormControl(null, [Validators.required]),
  ciudad: new FormControl(null, [Validators.required]),
  localidad: new FormControl(null, [Validators.required]),
  flyerNumber: new FormControl<string | number>(null),
};
