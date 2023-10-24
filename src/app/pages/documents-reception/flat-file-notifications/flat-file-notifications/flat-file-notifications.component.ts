import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { dateRangeValidator } from 'src/app/common/validations/date.validators';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FlatFileNotificationsService } from '../flat-file-notifications.service';

@Component({
  selector: 'app-flat-file-notifications',
  templateUrl: './flat-file-notifications.component.html',
  styles: [],
})
export class FlatFileNotificationsComponent extends BasePage implements OnInit {
  notificationsForm: FormGroup;
  invalidDate = false;
  minDate: Date;
  maxDate: Date = new Date();
  result1: any;
  delegations: DefaultSelect = new DefaultSelect([], 0);

  get startDate(): AbstractControl {
    return this.notificationsForm.get('startDate');
  }
  get endDate(): AbstractControl {
    return this.notificationsForm.get('endDate');
  }
  constructor(
    private fb: FormBuilder,
    private fileNotificationServices: FlatFileNotificationsService,
    private datePipe: DatePipe,
    private subDelegationService: SubDelegationService,
    private delegationService: DelegationService,
    private parametersService: ParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.notificationsForm = this.fb.group(
      {
        delegation: [null, [Validators.required]],
        subdelegation: [null],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        file: [null],
        name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      },
      { validator: dateRangeValidator() }
    );
    this.notificationsForm.get('endDate').disable();
  }
  getEndDateErrorMessage(fin: any, ini: any) {
    console.log(fin, ini);
    const stard = new Date(ini.value).getTime();
    const end = new Date(fin.value).getTime();
    if (fin && ini) {
      return stard <= end
        ? null
        : 'La fecha de finalización debe ser mayor que la fecha de inicio.';
    }
    return '';
  }

  Generar() {
    const start = new Date(this.notificationsForm.get('startDate').value);
    const end = new Date(this.notificationsForm.get('endDate').value);

    /*const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;*/
    const startTemp = this.datePipe.transform(start, 'dd-MM-yyyy');
    const endTemp = this.datePipe.transform(end, 'dd-MM-yyyy');

    this.fileNotificationServices
      .getFileNotification(
        this.notificationsForm.get('delegation').value,
        startTemp,
        endTemp
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.file.base64 !== '') {
            this.downloadExcel(resp.file.base64);
          } else {
            this.onLoadToast(
              'warning',
              'Advertencia',
              'No se Encontró Datos para Generar el Archivo'
            );
          }
          return;
        },
      });
  }

  downloadExcel(pdf: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdf}`;
    const downloadLink = document.createElement('a');
    downloadLink.download = `${this.notificationsForm.value.name}`;
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.onLoadToast(
      'success',
      'Archivo de Notificaciones',
      'Generado Correctamente'
    );
    this.cleanForm();
  }

  cleanForm() {
    this.notificationsForm.reset();
    this.notificationsForm.get('endDate').disable();
  }

  validateDate(event: Date) {
    //console.log(event);
    if (event) {
      this.minDate = event;
      this.notificationsForm.get('endDate').enable();
    }
  }

  async getCatalogDelegation(params: ListParams) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${year}/${month}/${day}`;
    const etapa = await this.getFaStageCreda(SYSDATE);
    params['filter.etapaEdo'] = `$eq:${etapa}`;
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.id'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }
    this.delegationService.getAll(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result1 = resp.data.map(async (item: any) => {
          item['noDelDesc'] = item.id + ' - ' + item.description;
        });
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.delegations = new DefaultSelect();
      },
    });
  }
  async getFaStageCreda(data: any) {
    return firstValueFrom(
      this.parametersService.getFaStageCreda(data).pipe(
        catchError(error => {
          return of(null);
        }),
        map(resp => resp.stagecreated)
      )
    );
  }
  changeDelegation(event: any) {}
}
