import { FormControl } from '@angular/forms';

export class EventStadisticsForm {
  des_bienes = new FormControl<string | number>(null);
  des_cant = new FormControl<string | number>(null);
  des_salida = new FormControl<string | number>(null);
  des_total = new FormControl<string | number>(null);
  lotes_des = new FormControl<string | number>(null);
  lotes_pag = new FormControl<string | number>(null);
  lotes_penal = new FormControl<string | number>(null);
  num_bienes = new FormControl<string | number>(null);
  num_lotes = new FormControl<string | number>(null);
  pag_bienes = new FormControl<string | number>(null);
  pag_cant = new FormControl<string | number>(null);
  pag_salida = new FormControl<string | number>(null);
  pag_total = new FormControl<string | number>(null);
  pen_bienes = new FormControl<string | number>(null);
  pen_cant = new FormControl<string | number>(null);
  pen_salida = new FormControl<string | number>(null);
  pen_total = new FormControl<string | number>(null);
  tot_base = new FormControl<string | number>(null);
  tot_cant = new FormControl<string | number>(null);
}
