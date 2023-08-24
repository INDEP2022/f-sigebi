import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeSiniester } from 'src/app/core/models/catalogs/type-siniester.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TypeSiniesterService } from 'src/app/core/services/catalogs/type-siniester.service';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-claims-follow-up-detail',
  templateUrl: './claims-follow-up-detail.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }

      /* input[type = file]::file-selector-button:hover {
        background: #9D2449;
      } */
    `,
  ],
})
export class ClaimsFollowUpDetailComponent extends BasePage implements OnInit {
  claimsFollowUpDetailForm: FormGroup;
  siniester: any;
  good: any;
  edit: boolean = false;
  typeSiniester = new DefaultSelect<ITypeSiniester>();
  unitAdminUser = new DefaultSelect<any>();
  shapeConclusion = new DefaultSelect<any>();
  fileLetterClaimIn: any;
  fileDocOfficeMinConcluIn: any;
  fileDocOfficeMailIn: any;
  fileDocAmountIndemnizedIn: any;
  tipeFirstSecondLater = new DefaultSelect<any>();
  status = new DefaultSelect<any>();
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalRef: BsModalRef,
    private authService: AuthService,
    private typeSinisterService: TypeSiniesterService,
    private seraLogService: SeraLogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.tipeFirstSecondLater = new DefaultSelect([
      { value: '1', description: '1ER CAPA' },
      { value: '2', description: '2DA CAPA' },
      { value: '3', description: '1ER CAPA / 2DA CAPA' },
    ]);
    // this.status = new DefaultSelect([
    //   { value: '1', description: 'ABIERTO' },
    //   { value: '2', description: 'CERRADO' },
    // ]);
    this.prepareForm();
  }
  private prepareForm() {
    this.claimsFollowUpDetailForm = this.fb.group({
      sinisterInId: [null],
      operation: [null],
      numberInGood: [null, [Validators.required]],
      description: [null, [Validators.required]],
      fecRepCabiIn: [null],
      fecRepAseguradoraIn: [null],
      fecSinisterIn: [null, [Validators.required]],
      typeSinisterIn: [null, [Validators.required]],
      docOfficeMailIn: [null],
      sinisterIn: [null],
      policyAffectedIn: [null],
      unitAdminUserIn: [null, [Validators.required]],
      detGoodoAffectedIn: [null, [Validators.required]],
      claimedAmountIn: [null],
      adjustedAmountIn: [null],
      deductibleIn: [null],
      coinsuranceIn: [null],
      amountIndemnizedIn: [null],
      letterClaimIn: [null],
      orderOfEntryIn: [null],
      docOfficeMinConcluIn: [null],
      statusIn: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      firstSecondLaterIn: [null],
      shapeConclusionIn: [null, [Validators.required]],
      dateIndemnizationIn: [null],
      docLetterRelcamationIn: [null],
      docAmountIndemnizedIn: [null],
    });
    if (this.siniester) {
      console.log(this.siniester);
      this.claimsFollowUpDetailForm.patchValue(this.siniester);
      if (this.siniester.idsiniestro) {
        this.claimsFollowUpDetailForm.controls['sinisterInId'].setValue(
          this.siniester.idsiniestro
        );
      }
      this.claimsFollowUpDetailForm.controls['operation'].setValue('2');
      if (this.siniester.fechareportecabi) {
        this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].setValue(
          this.dateConvert(this.siniester.fechareportecabi)
        );
      }
      if (this.siniester.fechareporteaseguradora) {
        this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].setValue(
          this.dateConvert(this.siniester.fechareporteaseguradora)
        );
      }
      if (this.siniester.fechasiniestro) {
        this.claimsFollowUpDetailForm.controls['fecSinisterIn'].setValue(
          this.dateConvert(this.siniester.fechasiniestro)
        );
      }
      if (this.siniester.tiposiniestroid) {
        this.claimsFollowUpDetailForm.controls['typeSinisterIn'].setValue(
          this.siniester.tiposiniestroid
        );
      }
      if (this.siniester.siniestro) {
        this.claimsFollowUpDetailForm.controls['sinisterIn'].setValue(
          this.siniester.siniestro
        );
      }
      // this.claimsFollowUpDetailForm.controls['docOfficeMailIn'].setValue(this.siniester.docoficiocorreo);
      if (this.siniester.polizaafectada) {
        this.claimsFollowUpDetailForm.controls['policyAffectedIn'].setValue(
          this.siniester.polizaafectada
        );
      }
      if (this.siniester.delegationnumber) {
        this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].setValue(
          this.siniester.delegationnumber
        );
      }
      if (this.siniester.detallebienoafectadas) {
        this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].setValue(
          this.siniester.detallebienoafectadas
        );
      }
      if (this.siniester.montoreclamado) {
        this.claimsFollowUpDetailForm.controls['claimedAmountIn'].setValue(
          this.siniester.montoreclamado
        );
      }
      if (this.siniester.montoajustado) {
        this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].setValue(
          this.siniester.montoajustado
        );
      }
      if (this.siniester.deducible) {
        this.claimsFollowUpDetailForm.controls['deductibleIn'].setValue(
          this.siniester.deducible
        );
      }
      if (this.siniester.coaseguro) {
        this.claimsFollowUpDetailForm.controls['coinsuranceIn'].setValue(
          this.siniester.coaseguro
        );
      }
      if (this.siniester.montoindemnizado) {
        this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].setValue(
          this.siniester.montoindemnizado
        );
      }
      if (this.siniester.cartareclamacion) {
        this.claimsFollowUpDetailForm.controls['letterClaimIn'].setValue(
          this.dateConvert(this.siniester.cartareclamacion)
        );
      }
      if (this.siniester.ordendeingreso) {
        this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].setValue(
          this.siniester.ordendeingreso
        );
      }
      if (this.siniester.estatusid) {
        // this.claimsFollowUpDetailForm.controls['docOfficeMinConcluIn'].setValue(this.siniester.docoficiominutaconclusion);
        this.claimsFollowUpDetailForm.controls['statusIn'].setValue(
          this.siniester.estatusid
        );
      }
      if (this.siniester.primersegundacapa) {
        this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].setValue(
          this.siniester.primersegundacapa
        );
      }
      if (this.siniester.formaconclusionid) {
        this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].setValue(
          this.siniester.formaconclusionid
        );
      }
      if (this.siniester.fechaindemnizacion) {
        this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].setValue(
          this.dateConvert(this.siniester.fechaindemnizacion)
        );
      }

      // this.claimsFollowUpDetailForm.controls['docAmountIndemnizedIn'].setValue(this.siniester.docmontoindemnizado);
      // this.claimsFollowUpDetailForm.controls['docLetterRelcamationIn'].setValue(this.siniester.doccartareclamacion);
      if (this.good.numberInGood) {
        this.claimsFollowUpDetailForm.controls['numberInGood'].setValue(
          this.good.numberInGood
        );
      }
      if (this.good.description) {
        this.claimsFollowUpDetailForm.controls['description'].setValue(
          this.good.description
        );
      }
      this.edit = true;
      this.getTipeSiniester(new ListParams(), this.siniester.tiposiniestroid);
    } else if (this.good) {
      this.claimsFollowUpDetailForm.controls['numberInGood'].setValue(
        this.good.numberInGood
      );
      this.claimsFollowUpDetailForm.controls['description'].setValue(
        this.good.description
      );
    }

    this.getTipeSiniester(new ListParams());
    this.getObtnObtenUnidadesResp(new ListParams());
    this.getshapeConclusion(new ListParams());
    this.getStatusSinister(new ListParams());
    setTimeout(() => {
      this.claimsFollowUpDetailForm.controls['statusIn'].setValue('1');
      this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].setValue('0');
    }, 1000);
  }

  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit === true ? this.updateSinister() : this.createSinister();
  }
  getTipeSiniester(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    if (params.text) {
      params['filter.description'] = `$ilike:${params.text}`;
      delete params.text;
      delete params['search'];
    }
    console.log(params);

    this.typeSinisterService.getAll(params).subscribe({
      next: response => {
        this.typeSiniester = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.typeSiniester = new DefaultSelect([], 0, true);
      },
    });
  }
  getObtnObtenUnidadesResp(params: ListParams) {
    if (params.text != null && params.text != '') {
      params['filter.descripcion'] = `$ilike:${params.text}`;
      delete params.text;
      delete params['search'];
    }
    params['sortBy'] = 'descripcion:ASC';
    // params['filter.no_delegacion'] = `$eq:${this.authService.decodeToken().department}`;
    this.seraLogService.getObtnObtenUnidadesResp(params).subscribe({
      next: response => {
        this.unitAdminUser = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.unitAdminUser = new DefaultSelect([], 0, true);
      },
    });
  }
  getshapeConclusion(params: ListParams) {
    this.typeSinisterService.getAllConclusion(params).subscribe({
      next: response => {
        console.log(response);
        this.shapeConclusion = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.shapeConclusion = new DefaultSelect([], 0, true);
      },
    });
  }
  getStatusSinister(params: ListParams) {
    if (params.text != null && params.text != '') {
      params['filter.descripcion'] = `$ilike:${params.text}`;
      delete params.text;
      delete params['search'];
    }
    this.typeSinisterService.getStatusSinister(params).subscribe({
      next: response => {
        console.log(response);
        this.status = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.status = new DefaultSelect([], 0, true);
      },
    });
  }
  updateSinister() {
    const formData = new FormData();
    if (this.fileDocOfficeMinConcluIn) {
      formData.append('docOfficeMinConcluIn', this.fileDocOfficeMinConcluIn);
    }
    if (this.fileLetterClaimIn) {
      formData.append('docLetterRelcamationIn', this.fileLetterClaimIn);
    }
    if (this.fileDocOfficeMailIn) {
      formData.append('docOfficeMailIn', this.fileDocOfficeMailIn);
    }
    if (this.fileDocAmountIndemnizedIn) {
      formData.append('docAmountIndemnizedIn', this.fileDocAmountIndemnizedIn);
    }
    formData.append(
      'sinisterInId',
      this.claimsFollowUpDetailForm.controls['sinisterInId'].value
    );
    formData.append('operation', '2');
    formData.append(
      'sinisterIn',
      this.claimsFollowUpDetailForm.controls['sinisterIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['sinisterIn'].value
        : ''
    );
    formData.append(
      'numberInGood',
      this.claimsFollowUpDetailForm.controls['numberInGood'].value
    );
    formData.append(
      'policyAffectedIn',
      this.claimsFollowUpDetailForm.controls['policyAffectedIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['policyAffectedIn'].value
        : ''
    );
    formData.append(
      'typeSinisterIn',
      this.claimsFollowUpDetailForm.controls['typeSinisterIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['typeSinisterIn'].value
        : ''
    );
    formData.append(
      'detGoodoAffectedIn',
      this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].value
        : ''
    );
    formData.append(
      'fecSinisterIn',
      this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value != null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value
          )
        : ''
    );
    formData.append(
      'fecRepAseguradoraIn',
      this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value !=
        null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value
          )
        : ''
    );
    formData.append(
      'fecRepCabiIn',
      this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value != null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value
          )
        : ''
    );
    formData.append(
      'unitAdminUserIn',
      this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].value
        : ''
    );
    formData.append(
      'claimedAmountIn',
      this.claimsFollowUpDetailForm.controls['claimedAmountIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['claimedAmountIn'].value
        : ''
    );
    formData.append(
      'adjustedAmountIn',
      this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].value
        : ''
    );
    formData.append(
      'deductibleIn',
      this.claimsFollowUpDetailForm.controls['deductibleIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['deductibleIn'].value
        : ''
    );
    formData.append(
      'coinsuranceIn',
      this.claimsFollowUpDetailForm.controls['coinsuranceIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['coinsuranceIn'].value
        : ''
    );
    formData.append(
      'amountIndemnizedIn',
      this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].value
        : ''
    );
    formData.append(
      'dateIndemnizationIn',
      this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value !=
        null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value
          )
        : ''
    );
    formData.append(
      'shapeConclusionIn',
      this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].value
        : ''
    );
    formData.append(
      'letterClaimIn',
      this.claimsFollowUpDetailForm.controls['letterClaimIn'].value != null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['letterClaimIn'].value
          )
        : ''
    );
    formData.append(
      'orderOfEntryIn',
      this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].value
        : ''
    );
    formData.append(
      'firstSecondLaterIn',
      this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value !=
        null &&
        this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value !=
          'null'
        ? this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value
        : ''
    );
    formData.append(
      'statusIn',
      this.claimsFollowUpDetailForm.controls['statusIn'].value != null &&
        this.claimsFollowUpDetailForm.controls['statusIn'].value != 'null'
        ? this.claimsFollowUpDetailForm.controls['statusIn'].value
        : ''
    );
    console.log('fromdata' + formData);
    this.seraLogService.postSaveSinisterRecord(formData).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: eror => {
        this.alert(
          'warning',
          'Siniestros Seguimiento',
          'Error intentelo de nuevo.'
        );
      },
    });
  }
  createSinister() {
    const formData = new FormData();
    if (this.fileDocOfficeMinConcluIn) {
      formData.append('docOfficeMinConcluIn', this.fileDocOfficeMinConcluIn);
    }
    if (this.fileLetterClaimIn) {
      formData.append('docLetterRelcamationIn', this.fileLetterClaimIn);
    }
    if (this.fileDocOfficeMailIn) {
      formData.append('docOfficeMailIn', this.fileDocOfficeMailIn);
    }
    if (this.fileDocAmountIndemnizedIn) {
      formData.append('docAmountIndemnizedIn', this.fileDocAmountIndemnizedIn);
    }
    formData.append('operation', '1');
    // formData.append('sinisterInId', '39');
    formData.append(
      'sinisterIn',
      this.claimsFollowUpDetailForm.controls['sinisterIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['sinisterIn'].value
        : ''
    );
    formData.append(
      'numberInGood',
      this.claimsFollowUpDetailForm.controls['numberInGood'].value
    );
    formData.append(
      'policyAffectedIn',
      this.claimsFollowUpDetailForm.controls['policyAffectedIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['policyAffectedIn'].value
        : ''
    );
    formData.append(
      'typeSinisterIn',
      this.claimsFollowUpDetailForm.controls['typeSinisterIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['typeSinisterIn'].value
        : ''
    );
    formData.append(
      'detGoodoAffectedIn',
      this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].value
        : ''
    );
    formData.append(
      'fecSinisterIn',
      this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value != null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value
          )
        : ''
    );
    formData.append(
      'fecRepAseguradoraIn',
      this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value !=
        null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value
          )
        : ''
    );
    formData.append(
      'fecRepCabiIn',
      this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value != null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value
          )
        : ''
    );
    formData.append(
      'unitAdminUserIn',
      this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].value
        : ''
    );
    formData.append(
      'claimedAmountIn',
      this.claimsFollowUpDetailForm.controls['claimedAmountIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['claimedAmountIn'].value
        : ''
    );
    formData.append(
      'adjustedAmountIn',
      this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].value
        : ''
    );
    formData.append(
      'deductibleIn',
      this.claimsFollowUpDetailForm.controls['deductibleIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['deductibleIn'].value
        : ''
    );
    formData.append(
      'coinsuranceIn',
      this.claimsFollowUpDetailForm.controls['coinsuranceIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['coinsuranceIn'].value
        : ''
    );
    formData.append(
      'amountIndemnizedIn',
      this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].value
        : ''
    );
    formData.append(
      'dateIndemnizationIn',
      this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value !=
        null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value
          )
        : ''
    );
    formData.append(
      'shapeConclusionIn',
      this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].value
        : ''
    );
    formData.append(
      'letterClaimIn',
      this.claimsFollowUpDetailForm.controls['letterClaimIn'].value != null
        ? this.convertDate(
            this.claimsFollowUpDetailForm.controls['letterClaimIn'].value
          )
        : ''
    );
    formData.append(
      'orderOfEntryIn',
      this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].value != null
        ? this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].value
        : ''
    );
    formData.append(
      'firstSecondLaterIn',
      this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value !=
        null &&
        this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value !=
          'null'
        ? this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value
        : ''
    );
    formData.append(
      'statusIn',
      this.claimsFollowUpDetailForm.controls['statusIn'].value != null &&
        this.claimsFollowUpDetailForm.controls['statusIn'].value != 'null'
        ? this.claimsFollowUpDetailForm.controls['statusIn'].value
        : ''
    );
    this.seraLogService.postSaveSinisterRecord(formData).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: eror => {
        this.alert(
          'warning',
          'Siniestros Seguimiento',
          'Error intentelo de nuevo.'
        );
      },
    });
  }
  chargeFileLetterClaimIn(event: any) {
    console.log(event.target.files[0]);
    this.fileLetterClaimIn = event.target.files[0];
  }
  chargeFileDocOfficeMinConcluIn(event: any) {
    console.log(event.target.files[0]);
    this.fileDocOfficeMinConcluIn = event.target.files[0];
  }
  chargeFileDocOfficeMailIn(event: any) {
    console.log(event.target.files[0]);
    this.fileDocOfficeMailIn = event.target.files[0];
  }
  chargeFileDocAmountIndemnizedIn(event: any) {
    console.log(event.target.files[0]);
    this.fileDocAmountIndemnizedIn = event.target.files[0];
  }
  convertDate(date: Date): string {
    const dateString: string = this.datePipe.transform(date, 'dd/MM/yyyy');
    return dateString;
  }
  dateConvert(date: string): Date {
    if (date != 'null' && date != undefined) {
      console.log(date);
      // const dates = new Date(date);
      // const datePipe = new DatePipe('en-US');
      // const formatTrans = datePipe.transform(dates, 'dd/MM/yyyy', 'UTC');
      const partesFecha1 = date.split('/');
      const dateConvert = new Date(
        Number(partesFecha1[2]),
        Number(partesFecha1[1]) - 1,
        Number(partesFecha1[0])
      );
      return dateConvert;
    } else {
      return null;
    }
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Siniestros Seguimiento', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
