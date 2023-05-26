import { FormControl, Validators } from '@angular/forms';
import { onlyNumbers } from 'src/app/common/validations/numeric.validators';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

export class GOOD_CAPTURE_FORM {
  noPartida = new FormControl<string>(null, [
    Validators.minLength(6),
    Validators.maxLength(8),
    onlyNumbers(),
  ]);
  valorAvaluo = new FormControl<number>(null);
  capitulo = new FormControl('');
  partida = new FormControl('');
  subpartida = new FormControl('');
  ssubpartida = new FormControl('');
  noClasifBien = new FormControl<number>(null, [Validators.required]);
  type = new FormControl<string | number>(null, [Validators.required]);
  subtype = new FormControl<string | number>('', [Validators.required]);
  ssubtype = new FormControl<string | number>('', [Validators.required]);
  sssubtype = new FormControl<string | number>('', [Validators.required]);
  unidadLigie = new FormControl({ value: null, disabled: true });
  unidadMedida = new FormControl(null, [Validators.required]);
  cantidad = new FormControl<number>(null, [
    // Validators.pattern(NUMBERS_PATTERN),
    Validators.required,
    Validators.min(1),
    Validators.max(999999999999),
  ]);
  destino = new FormControl(null, [Validators.required]);
  estadoConservacion = new FormControl(null);
  noBien = new FormControl({ value: null, disabled: true }, [
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  valRef = new FormControl(null, [
    Validators.min(1),
    Validators.max(999999999999),
    Validators.pattern(DOUBLE_PATTERN),
  ]);
  identifica = new FormControl(null, [Validators.required]);
  descripcion = new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(1250),
  ]);
  fichaNumerario = new FormControl(null);
  captura = new FormControl('');
  cambioValor = new FormControl('');
  requery = new FormControl(null);
  satTipoExpediente = new FormControl(null);
  satIndicator = new FormControl(null);
  validFrac = new FormControl(null);
  almacen = new FormControl(false);
  entFed = new FormControl(null);
  municipio = new FormControl(null);
  ciudad = new FormControl(null);
  localidad = new FormControl(null);
  flyerNumber = new FormControl<string | number>(null);
  observaciones = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(600),
  ]);
  esEmpresa = new FormControl<boolean>(null);
  noExpediente = new FormControl<number>(null);
  status = new FormControl<string>(null);
}

export class GOOD_FORM {
  val1 = new FormControl(null);
  val2 = new FormControl(null);
  val3 = new FormControl(null);
  val4 = new FormControl(null);
  val5 = new FormControl(null);
  val6 = new FormControl(null);
  val7 = new FormControl(null);
  val8 = new FormControl(null);
  val9 = new FormControl(null);
  val10 = new FormControl(null);
  val11 = new FormControl(null);
  val12 = new FormControl(null);
  val13 = new FormControl(null);
  val14 = new FormControl(null);
  val15 = new FormControl(null);
  val16 = new FormControl(null);
  val17 = new FormControl(null);
  val18 = new FormControl(null);
  val19 = new FormControl(null);
  val20 = new FormControl(null);
  val21 = new FormControl(null);
  val22 = new FormControl(null);
  val23 = new FormControl(null);
  val24 = new FormControl(null);
  val25 = new FormControl(null);
  val26 = new FormControl(null);
  val27 = new FormControl(null);
  val28 = new FormControl(null);
  val29 = new FormControl(null);
  val30 = new FormControl(null);
  val31 = new FormControl(null);
  val32 = new FormControl(null);
  val33 = new FormControl(null);
  val34 = new FormControl(null);
  val35 = new FormControl(null);
  val36 = new FormControl(null);
  val37 = new FormControl(null);
  val38 = new FormControl(null);
  val39 = new FormControl(null);
  val40 = new FormControl(null);
  val41 = new FormControl(null);
  val42 = new FormControl(null);
  val43 = new FormControl(null);
  val44 = new FormControl(null);
  val45 = new FormControl(null);
  val46 = new FormControl(null);
  val47 = new FormControl(null);
  val48 = new FormControl(null);
  val49 = new FormControl(null);
  val50 = new FormControl(null);
  val51 = new FormControl(null);
  val52 = new FormControl(null);
  val53 = new FormControl(null);
  val54 = new FormControl(null);
  val55 = new FormControl(null);
  val56 = new FormControl(null);
  val57 = new FormControl(null);
  val58 = new FormControl(null);
  val59 = new FormControl(null);
  val60 = new FormControl(null);
  val61 = new FormControl(null);
  val62 = new FormControl(null);
  val63 = new FormControl(null);
  val64 = new FormControl(null);
  val65 = new FormControl(null);
  val66 = new FormControl(null);
  val67 = new FormControl(null);
  val68 = new FormControl(null);
  val69 = new FormControl(null);
  val70 = new FormControl(null);
  val71 = new FormControl(null);
  val72 = new FormControl(null);
  val73 = new FormControl(null);
  val74 = new FormControl(null);
  val75 = new FormControl(null);
  val76 = new FormControl(null);
  val77 = new FormControl(null);
  val78 = new FormControl(null);
  val79 = new FormControl(null);
  val80 = new FormControl(null);
  val81 = new FormControl(null);
  val82 = new FormControl(null);
  val83 = new FormControl(null);
  val84 = new FormControl(null);
  val85 = new FormControl(null);
  val86 = new FormControl(null);
  val87 = new FormControl(null);
  val88 = new FormControl(null);
  val89 = new FormControl(null);
  val90 = new FormControl(null);
  val91 = new FormControl(null);
  val92 = new FormControl(null);
  val93 = new FormControl(null);
  val94 = new FormControl(null);
  val95 = new FormControl(null);
  val96 = new FormControl(null);
  val97 = new FormControl(null);
  val98 = new FormControl(null);
  val99 = new FormControl(null);
  val100 = new FormControl(null);
  val101 = new FormControl(null);
  val102 = new FormControl(null);
  val103 = new FormControl(null);
  val104 = new FormControl(null);
  val105 = new FormControl(null);
  val106 = new FormControl(null);
  val107 = new FormControl(null);
  val108 = new FormControl(null);
  val109 = new FormControl(null);
  val110 = new FormControl(null);
  val111 = new FormControl(null);
  val112 = new FormControl(null);
  val113 = new FormControl(null);
  val114 = new FormControl(null);
  val115 = new FormControl(null);
  val116 = new FormControl(null);
  val117 = new FormControl(null);
  val118 = new FormControl(null);
  val119 = new FormControl(null);
  val120 = new FormControl(null);
}

export class GOOD_TO_SAVE {
  goodClassNumber: string;
  description: string;
  quantity: string;
  observations: string;
  identifier: string;
  status: string;
  labelNumber: string;
  unit: string;
  referenceValue: string;
  satDepartureNumber: string;
  vaultNumber: string;
  stateConservation: string;
  fileNumber: string;
  flyerNumber: string | number;
  val1: string;
  val2: string;
  val3: string;
  val4: string;
  val5: string;
  val6?: any;
  val7: string;
  val8: string;
  val9: string;
  val10: string;
  val11: string;
  val12?: any;
  val13?: any;
  val14: string;
  val15: string;
  val16: string;
  val17: string;
  val18?: any;
  val19?: any;
  val20?: any;
  val21?: any;
  val22?: any;
  val23?: any;
  val24?: any;
  val25?: any;
  val26?: any;
  val27?: any;
  val28?: any;
  val29?: any;
  val30?: any;
  val31?: any;
  val32?: any;
  val33?: any;
  val34?: any;
  val35?: any;
  val36?: any;
  val37?: any;
  val38?: any;
  val39?: any;
  val40?: any;
  val41?: any;
  val42?: any;
  val43?: any;
  val44?: any;
  val45?: any;
  val46?: any;
  val47?: any;
  val48?: any;
  val49?: any;
  val50?: any;
  val51?: any;
  val52?: any;
  val53?: any;
  val54?: any;
  val55?: any;
  val56?: any;
  val57?: any;
  val58?: any;
  val59?: any;
  val60?: any;
  val61?: any;
  val62?: any;
  val63?: any;
  val64?: any;
  val65?: any;
  val66?: any;
  val67?: any;
  val68?: any;
  val69?: any;
  val70?: any;
  val71?: any;
  val72?: any;
  val73?: any;
  val74?: any;
  val75?: any;
  val76?: any;
  val77?: any;
  val78?: any;
  val79?: any;
  val80?: any;
  val81?: any;
  val82?: any;
  val83?: any;
  val84?: any;
  val85?: any;
  val86?: any;
  val87?: any;
  val88?: any;
  val89?: any;
  val90?: any;
  val91?: any;
  val92?: any;
  val93?: any;
  val94?: any;
  val95?: any;
  val96?: any;
  val97?: any;
  val98?: any;
  val99?: any;
  val100?: any;
  val101?: any;
  val102?: any;
  val103?: any;
  val104?: any;
  val105?: any;
  val106?: any;
  val107?: any;
  val108?: any;
  val109?: any;
  val110?: any;
  val111?: any;
  val112?: any;
  val113?: any;
  val114?: any;
  val115?: any;
  val116?: any;
  val117?: any;
  val118?: any;
  val119?: any;
  val120?: any;
}
