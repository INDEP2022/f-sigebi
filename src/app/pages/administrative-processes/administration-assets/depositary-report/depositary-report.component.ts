import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { IInfoDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-depositary-report',
  templateUrl: './depositary-report.component.html',
  styles: [
    `
      #disabled {
        color: #555 !important;
        background-color: #eeeeee !important;
        border-bottom-color: #74788d !important;
        :hover {
          cursor: not-allowed;
        }
      }
    `,
  ],
})
export class DepositaryReportComponent extends BasePage implements OnInit {
  depositaryDataForm: FormGroup;
  persons = new DefaultSelect<IPerson>();
  @Input() goodId: number;
  disableButton: boolean = false;

  ngOnInit(): void {
    this.prepareForm();
    this.depositaryDataForm.get('reportDate').disable();
    this.depositaryDataForm.get('personNum').disable();
  }
  constructor(
    private fb: FormBuilder,
    private readonly depositaryService: MsDepositaryService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getInfoDepositary(this.goodId);
    }
  }

  private prepareForm() {
    this.depositaryDataForm = this.fb.group({
      reportDate: [null, [Validators.required]],
      personNum: [null, [Validators.required]],
      noPerson: [null],
      report: [null, [Validators.required]],
    });
  }

  getInfoDepositary(goodId: number) {
    const params: ListParams = {};
    params['filter.goodNum'] = `$eq:${goodId}`;
    this.depositaryService.getInfoDepositary(params).subscribe({
      next: response => {
        response.data[0].reportDate = this.formatearFecha(
          response.data[0].reportDate.toString()
        );
        this.depositaryDataForm.patchValue(response.data[0]);
      },
      error: err => {
        this.depositaryDataForm.get('report').disable();
        this.disableButton = true;
      },
    });
  }

  updateInfoDepositary() {
    if (this.depositaryDataForm.get('reportDate').value >= new Date()) {
      this.alert(
        'warning',
        'Informe Depositaria',
        'La Fecha del Informe debe ser Menor a la Fecha Actual'
      );
      return;
    }
    if (
      this.depositaryDataForm.get('report').value === null ||
      this.depositaryDataForm.get('report').value === ''
    ) {
      this.alert('warning', 'Informe Depositaria', 'El Informe es Requerido');
      return;
    }
    const model: IInfoDepositary = {
      personNum: this.depositaryDataForm.get('personNum').value,
      report: this.depositaryDataForm.get('report').value,
      reportDate: this.formatearFechaRevert(
        this.depositaryDataForm.get('reportDate').value
      ),
    };
    this.depositaryService.putInfoDepositary(model).subscribe({
      next: response => {
        this.alert(
          'success',
          'Informe Depositaria',
          'Se ha Actualizado la Información del Informe de Depositaria del Bien'
        );
      },
      error: err => {
        console.log(err);
        this.alert(
          'error',
          'Ha Ocurrido un Error',
          'No se ha Actualizado la Información del Informe de Depositaria del Bien'
        );
      },
    });
  }

  formatearFecha(fecha: string) {
    var partesFecha = fecha.split('-');
    var anio = partesFecha[0];
    var mes = partesFecha[1];
    var dia = partesFecha[2];

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    var fechaFormateada = dia + '/' + mes + '/' + anio;
    console.log(fechaFormateada);
    return fechaFormateada;
  }

  formatearFechaRevert(fecha: string) {
    var partesFecha = fecha.split('/');
    var anio = partesFecha[2];
    var mes = partesFecha[1];
    var dia = partesFecha[0];

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    var fechaFormateada = anio + '-' + mes + '-' + dia;
    console.log(fechaFormateada);
    return fechaFormateada;
  }
}
