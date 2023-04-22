/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';


import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';

/** SERVICE IMPORTS */

import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { IReport, SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-generation-files-trades',
  templateUrl: './generation-files-trades.component.html',
  styleUrls: ['./generation-files-trades.component.scss'],
})
export class GenerationFilesTradesComponent
  extends BasePage
  implements OnInit, OnDestroy {
  public form: FormGroup;

  params = new BehaviorSubject(new FilterParams());
  actualrecord: IMJobManagement;

  constructor(
    private fb: FormBuilder,
    private service: MJobManagementService,
    private siabService: SiabService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noVolante: ['', [Validators.required]], //*
      noExpediente: '',
      noOficio: '',
      tipoOficio: ['', [Validators.pattern(STRING_PATTERN)]],
      estatus: ['', [Validators.pattern(STRING_PATTERN)]],
      cveOficio: ['', [Validators.pattern(KEYGENERATION_PATTERN)]], // Campo extenso
      oficioPor: ['', [Validators.pattern(STRING_PATTERN)]],
      remitente: ['', [Validators.pattern(STRING_PATTERN)]],
      destinatario: ['', [Validators.pattern(STRING_PATTERN)]],
      nomPerExt: ['', [Validators.pattern(STRING_PATTERN)]], // Campo extenso
    });
  }

  btnGenerarOficio(): any {
    console.log(this.form.value);
    let data = this.params.value;
    if (this.form.get('noVolante').value) {
      this.processFillForm(true, true);
    } else {
      this.onLoadToast('error', 'Error', "El número de volante es requerido");
      return;
    }
  }


  onChangeVolante() {
    this.clearForm();
    this.processFillForm(false, false);
  }

  clearForm() {
    this.form.get('cveOficio').setValue('');
    this.form.get('destinatario').setValue('');
    this.form.get('estatus').setValue('');
    this.form.get('noExpediente').setValue('');
    this.form.get('noOficio').setValue('');
    //this.form.get('noVolante').setValue('');
    this.form.get('nomPerExt').setValue('');
    this.form.get('oficioPor').setValue('');
    this.form.get('remitente').setValue('');
    this.form.get('tipoOficio').setValue('');
    this.actualrecord = null;

  }
  processFillForm(esReporte: boolean, emiteError: boolean) {
    let data = this.params.value;
    data.addFilter('flyerNumber', this.form.get('noVolante').value);
    this.service.getAllFiltered(data.getParams()).subscribe({
      next: data => {
        let registro = data.data[0];
        this.form.get('cveOficio').setValue(registro.cveManagement);
        this.form.get('destinatario').setValue(registro.addressee);
        this.form.get('estatus').setValue(registro.statusOf);
        this.form.get('noExpediente').setValue(registro.proceedingsNumber);
        this.form.get('noOficio').setValue(registro.cveManagement);
        this.form.get('noVolante').setValue(registro.flyerNumber);
        this.form.get('nomPerExt').setValue(registro.nomPersExt);
        this.form.get('oficioPor').setValue(registro.jobBy);
        this.form.get('remitente').setValue(registro.sender);
        this.form.get('tipoOficio').setValue(registro.jobType);
        this.actualrecord = registro;
        if (esReporte) {
          this.processReport();
        }
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        if (emiteError) {
          this.onLoadToast('error', 'Error', error);
        }
      },
      complete: () => { },
    });
  }

  processReport() {
    this.siabService.getReport(SiabReportEndpoints.RINDICA, this.form).subscribe(
      (report: IReport) => {
        console.log(report);
        //TODO: VIEW FILE
      },
      error => (this.loading = false)
    );

  }

  /*
  Notas

  Este codigo solo llama al servicio MJobManagementService para llenar el formulario

  llena el forlario usando processFillForm
  limpia el formulario usando clearForm

  cuando el volante cambia se llena el formulario 

  La funcion esta ajustada para llamar al reporte (No se ejecuto este)
  
  */


}
