import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { IInfoDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-depositary-report',
  templateUrl: './depositary-report.component.html',
  styles: [],
})
export class DepositaryReportComponent extends BasePage implements OnInit {
  depositaryDataForm: FormGroup;
  persons = new DefaultSelect<IPerson>();
  @Input() goodId: number;

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
      this.getInfoDepositary(3900);
    }
  }

  private prepareForm() {
    this.depositaryDataForm = this.fb.group({
      reportDate: [null],
      personNum: [null],
      noPerson: [null],
      report: [null],
    });
  }

  getInfoDepositary(goodId: number) {
    const params: ListParams = {};
    params['filter.soogNum'] = `$eq:${goodId}`;
    this.depositaryService.getInfoDepositary(params).subscribe({
      next: response => {
        response.data[0].reportDate = this.formatearFecha(
          response.data[0].reportDate.toString()
        );
        this.depositaryDataForm.patchValue(response.data[0]);
      },
      error: err => {},
    });
  }

  updateInfoDepositary() {
    if (this.depositaryDataForm.get('reportDate').value >= new Date()) {
      this.alert(
        'info',
        'Información',
        'La fecha del informe debe ser menor a la fecha actual'
      );
      return;
    }
    const model: IInfoDepositary = {
      personNum: this.depositaryDataForm.get('personNum').value,
      report: this.depositaryDataForm.get('report').value,
      reportDate: this.formatearFechaRevert(
        this.depositaryDataForm.get('reportDate').value
      ),
    };
    console.log(model);
    this.depositaryService.putInfoDepositary(model).subscribe({
      next: response => {
        this.alert(
          'success',
          'Actualizado',
          'Se ha actualizado la informacion del informe de depositaria del bien'
        );
      },
      error: err => {
        console.log(err);
        this.alert(
          'error',
          'Ha ocurrido un error',
          'No se ha actualizado la informacion del informe de depositaria del bien'
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
