import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DictaminacionService } from 'src/app/common/services/dictaminacion.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from '../../../../../@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { UsersSharedComponent } from '../../../../../@standalone/shared-forms/user-shared/user-shared.component';
import { ProgrammingRequestService } from '../../../../../core/services/ms-programming-request/programming-request.service';

@Component({
  selector: 'capture-filter-dictamina',
  templateUrl: './capture-filter-dictamina.component.html',
  standalone: true,
  styles: [],
  imports: [SharedModule, DelegationSharedComponent, UsersSharedComponent],
})
export class CaptureFilterDictaminaComponent implements OnInit {
  @Input() isReceptionAndDelivery: boolean = false;
  @Input() isReceptionStrategies: boolean = false;
  @Input() isConsolidated: boolean = false;
  @Output() reportEmite = new EventEmitter<any>();

  form = this.fb.group({
    de: [null, [Validators.required]],
    a: [null, [Validators.required]],
    coordinador: [null, [Validators.required]],
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
  selectUsuario = new DefaultSelect();
  selectCoordinador = new DefaultSelect();
  paramsFilter!: any;

  constructor(
    private fb: FormBuilder,
    private dictaminaService: DictaminacionService,
    private datePipe: DatePipe,
    private programmingRequestService: ProgrammingRequestService
  ) {}

  ngOnInit(): void {
    this.selectUsuario.data = ['Usuario1', 'Usuario2'];
    this.selectCoordinador.data = ['Coordinador1', 'Coordinador2'];
    this.setCustomValidators();
  }

  setCustomValidators(): void {
    this.form
      .get('a')
      ?.setValidators([Validators.required, this.validateDateRange.bind(this)]);
    this.form.get('a')?.updateValueAndValidity();
  }

  validateDateRange(control: AbstractControl): ValidationErrors | null {
    const startDate = this.form.get('de')?.value;
    const endDate = control.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        return {
          dateRangeError: 'La fecha "a" no puede ser menor que la fecha "de".',
        };
      }
    }

    return null;
  }

  onConsultar(): void {
    let paramsSeleccion = {
      de: this.datePipe.transform(this.form.value.de, 'yyyy-MM-dd'),
      a: this.datePipe.transform(this.form.value.a, 'yyyy-MM-dd'),
      coordinador: this.form.value.coordinador,
    };

    this.dictaminaService.setParamsDictaminacion(paramsSeleccion);
  }

  changeDelegation(event: any) {
    this.form.get('coordinador').patchValue(event?.id);
  }

  onClickReport() {
    let paramsSeleccion = {
      de: this.datePipe.transform(this.form.value.de, 'yyyy-MM-dd'),
      a: this.datePipe.transform(this.form.value.a, 'yyyy-MM-dd'),
      coordinador: this.form.value.coordinador,
    };

    this.reportEmite.emit(paramsSeleccion);
  }
}
