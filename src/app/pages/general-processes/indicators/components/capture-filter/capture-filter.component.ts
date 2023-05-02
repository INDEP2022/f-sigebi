import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'capture-filter',
  templateUrl: './capture-filter.component.html',
  standalone: true,
  imports: [SharedModule],
  styles: [],
})
export class CaptureFilterComponent implements OnInit {
  @Input() isReceptionAndDelivery: boolean = false;
  @Input() isReceptionStrategies: boolean = false;
  @Input() isConsolidated: boolean = false;
  form = this.fb.group({
    de: [null, [Validators.required]],
    a: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    cordinador: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
    transferente: [null, [Validators.required]],
    emisora: [null, [Validators.required]],
    autoridad: [null, [Validators.required]],
    clave: [null, [Validators.required]],
    tipoVolante: [null, [Validators.required]],
    tipoEvento: [null],
  });
  flyerTypes = ['A', 'AP', 'AS', 'AT', 'OF', 'P', 'PJ', 'T  '];
  eventTypes = [
    'Entrega-Comercialización',
    'Entrega-Donación',
    'Entrega-Destrucción',
    'Entrega-Devolución',
    'Recepción Física',
    'Entrega',
  ];
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
