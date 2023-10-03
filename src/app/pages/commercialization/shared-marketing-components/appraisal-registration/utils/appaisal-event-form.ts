import { FormControl } from '@angular/forms';

export class AppraisalEventForm {
  id_evento = new FormControl();
  id_tpevento = new FormControl({ value: null, disabled: true });
  id_estatusvta = new FormControl({ value: null, disabled: true });
  cve_proceso = new FormControl({ value: null, disabled: true });
  observaciones = new FormControl({ value: null, disabled: true });
  direccion = new FormControl({ value: null, disabled: true });
  fec_fallo = new FormControl({ value: null, disabled: true });
  lugar = new FormControl({ value: null, disabled: true });
  fec_evento = new FormControl({ value: null, disabled: true });
  texto1 = new FormControl({ value: null, disabled: true });
  texto2 = new FormControl({ value: null, disabled: true });
  firmante = new FormControl({ value: null, disabled: true });
  firmante_cargo = new FormControl({ value: null, disabled: true });
  notas = new FormControl({ value: null, disabled: true });
  textofin3 = new FormControl({ value: null, disabled: true });
  textofin4 = new FormControl({ value: null, disabled: true });
  costo_base = new FormControl({ value: null, disabled: true });
  num_base_vend = new FormControl({ value: null, disabled: true });
  usuario = new FormControl({ value: null, disabled: true });
  mes = new FormControl({ value: null, disabled: true });
  anio = new FormControl({ value: null, disabled: true });
  no_delegacion = new FormControl({ value: null, disabled: true });
  fase_inmu = new FormControl({ value: null, disabled: true });
  id_tercerocomer = new FormControl({ value: null, disabled: true });
  fecha_notificacion = new FormControl({ value: null, disabled: true });
  fecha_cierre_evento = new FormControl({ value: null, disabled: true });
  id_tpsolaval = new FormControl({ value: null, disabled: true });
  aplica_iva = new FormControl({ value: null, disabled: true });
  item_desc_tipo = new FormControl({ value: null, disabled: true });
  item_desc_estatus = new FormControl({ value: null, disabled: true });
  item_desc_tpsolaval = new FormControl({ value: null, disabled: true });
  item_fec_solicitud = new FormControl({ value: null, disabled: true });
  item_tipo_proceso = new FormControl({ value: null, disabled: true });
  documentType = new FormControl(null);
}
