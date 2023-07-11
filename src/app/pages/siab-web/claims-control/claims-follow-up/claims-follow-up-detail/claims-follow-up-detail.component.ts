import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeSiniester } from 'src/app/core/models/catalogs/type-siniester.model';
import { TypeSiniesterService } from 'src/app/core/services/catalogs/type-siniester.service';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-claims-follow-up-detail',
  templateUrl: './claims-follow-up-detail.component.html',
  styles: [],
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
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalRef: BsModalRef,
    private typeSinisterService: TypeSiniesterService,
    private seraLogService: SeraLogService
  ) {
    super();
  }

  ngOnInit(): void {
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
      fecSinisterIn: [null],
      typeSinisterIn: [null, [Validators.required]],
      docOfficeMailIn: [null],
      sinisterIn: [null],
      policyAffectedIn: [null],
      unitAdminUserIn: [null, [Validators.required]],
      detGoodoAffectedIn: [null, [Validators.required]],
      claimedAmountIn: [null, [Validators.required]],
      adjustedAmountIn: [null, [Validators.required]],
      deductibleIn: [null, [Validators.required]],
      coinsuranceIn: [null, [Validators.required]],
      amountIndemnizedIn: [null, [Validators.required]],
      letterClaimIn: [null],
      orderOfEntryIn: [null],
      docOfficeMinConcluIn: [null],
      statusIn: [null],
      firstSecondLaterIn: [null],
      shapeConclusionIn: [null, [Validators.required]],
      dateIndemnizationIn: [null, [Validators.required]],
      docLetterRelcamationIn: [null],
      docAmountIndemnizedIn: [null],
    });
    if (this.siniester) {
      console.log(this.siniester);
      this.claimsFollowUpDetailForm.patchValue(this.siniester);
      this.claimsFollowUpDetailForm.controls['sinisterInId'].setValue(
        this.siniester.idsiniestro
      );
      this.claimsFollowUpDetailForm.controls['operation'].setValue('2');
      this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].setValue(
        this.dateConvert(this.siniester.fechareportecabi)
      );
      this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].setValue(
        this.dateConvert(this.siniester.fechareporteaseguradora)
      );
      this.claimsFollowUpDetailForm.controls['fecSinisterIn'].setValue(
        this.dateConvert(this.siniester.fecSinisterIn)
      );
      this.claimsFollowUpDetailForm.controls['typeSinisterIn'].setValue(
        this.siniester.tiposiniestroid
      );
      // this.claimsFollowUpDetailForm.controls['docOfficeMailIn'].setValue(this.siniester.docoficiocorreo);
      this.claimsFollowUpDetailForm.controls['sinisterIn'].setValue(
        this.siniester.siniestro
      );
      this.claimsFollowUpDetailForm.controls['policyAffectedIn'].setValue(
        this.siniester.polizaafectada
      );
      this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].setValue(
        this.siniester.delegationnumber
      );
      this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].setValue(
        this.siniester.detallebienoafectadas
      );
      this.claimsFollowUpDetailForm.controls['claimedAmountIn'].setValue(
        this.siniester.montoreclamado
      );
      this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].setValue(
        this.siniester.montoajustado
      );
      this.claimsFollowUpDetailForm.controls['deductibleIn'].setValue(
        this.siniester.deducible
      );
      this.claimsFollowUpDetailForm.controls['coinsuranceIn'].setValue(
        this.siniester.coaseguro
      );
      this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].setValue(
        this.siniester.montoindemnizado
      );
      this.claimsFollowUpDetailForm.controls['letterClaimIn'].setValue(
        this.dateConvert(this.siniester.cartareclamacion)
      );
      this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].setValue(
        this.siniester.ordendeingreso
      );
      // this.claimsFollowUpDetailForm.controls['docOfficeMinConcluIn'].setValue(this.siniester.docoficiominutaconclusion);
      this.claimsFollowUpDetailForm.controls['statusIn'].setValue(
        this.siniester.estatusid
      );
      this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].setValue(
        this.siniester.primersegundacapa
      );
      this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].setValue(
        this.siniester.formaconclusionid
      );
      this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].setValue(
        this.dateConvert(this.siniester.fechaindemnizacion)
      );

      // this.claimsFollowUpDetailForm.controls['docAmountIndemnizedIn'].setValue(this.siniester.docmontoindemnizado);
      // this.claimsFollowUpDetailForm.controls['docLetterRelcamationIn'].setValue(this.siniester.doccartareclamacion);
      this.claimsFollowUpDetailForm.controls['numberInGood'].setValue(
        this.good.numberInGood
      );
      this.claimsFollowUpDetailForm.controls['description'].setValue(
        this.good.description
      );
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
    if (this.fileDocOfficeMailIn) {
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
      this.claimsFollowUpDetailForm.controls['policyAffectedIn'].value
    );
    formData.append(
      'typeSinisterIn',
      this.claimsFollowUpDetailForm.controls['typeSinisterIn'].value
    );
    formData.append(
      'detGoodoAffectedIn',
      this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].value
    );
    formData.append(
      'fecSinisterIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value != null
          ? this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value
          : ''
      )
    );
    formData.append(
      'fecRepAseguradoraIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value !=
          null
          ? this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value
          : ''
      )
    );
    formData.append(
      'fecRepCabiIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value != null
          ? this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value
          : ''
      )
    );
    formData.append(
      'unitAdminUserIn',
      this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].value
    );
    formData.append(
      'claimedAmountIn',
      this.claimsFollowUpDetailForm.controls['claimedAmountIn'].value
    );
    formData.append(
      'adjustedAmountIn',
      this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].value
    );
    formData.append(
      'deductibleIn',
      this.claimsFollowUpDetailForm.controls['deductibleIn'].value
    );
    formData.append(
      'coinsuranceIn',
      this.claimsFollowUpDetailForm.controls['coinsuranceIn'].value
    );
    formData.append(
      'amountIndemnizedIn',
      this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].value
    );
    formData.append(
      'dateIndemnizationIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value !=
          null
          ? this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value
          : ''
      )
    );
    formData.append(
      'shapeConclusionIn',
      this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].value
    );
    formData.append(
      'letterClaimIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['letterClaimIn'].value != null
          ? this.claimsFollowUpDetailForm.controls['letterClaimIn'].value
          : ''
      )
    );
    formData.append(
      'orderOfEntryIn',
      this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].value
    );
    formData.append(
      'firstSecondLaterIn',
      this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value
    );
    formData.append(
      'statusIn',
      this.claimsFollowUpDetailForm.controls['statusIn'].value
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
    if (this.fileDocOfficeMailIn) {
      formData.append('docAmountIndemnizedIn', this.fileDocAmountIndemnizedIn);
    }
    formData.append('operation', '1');
    // formData.append('sinisterInId', '39');
    formData.append(
      'sinisterIn',
      this.claimsFollowUpDetailForm.controls['sinisterIn'].value
    );
    formData.append(
      'numberInGood',
      this.claimsFollowUpDetailForm.controls['numberInGood'].value
    );
    formData.append(
      'policyAffectedIn',
      this.claimsFollowUpDetailForm.controls['policyAffectedIn'].value
    );
    formData.append(
      'typeSinisterIn',
      this.claimsFollowUpDetailForm.controls['typeSinisterIn'].value
    );
    formData.append(
      'detGoodoAffectedIn',
      this.claimsFollowUpDetailForm.controls['detGoodoAffectedIn'].value
    );
    formData.append(
      'fecSinisterIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value != null
          ? this.claimsFollowUpDetailForm.controls['fecSinisterIn'].value
          : ''
      )
    );
    formData.append(
      'fecRepAseguradoraIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value !=
          null
          ? this.claimsFollowUpDetailForm.controls['fecRepAseguradoraIn'].value
          : ''
      )
    );
    formData.append(
      'fecRepCabiIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value != null
          ? this.claimsFollowUpDetailForm.controls['fecRepCabiIn'].value
          : ''
      )
    );
    formData.append(
      'unitAdminUserIn',
      this.claimsFollowUpDetailForm.controls['unitAdminUserIn'].value
    );
    formData.append(
      'claimedAmountIn',
      this.claimsFollowUpDetailForm.controls['claimedAmountIn'].value
    );
    formData.append(
      'adjustedAmountIn',
      this.claimsFollowUpDetailForm.controls['adjustedAmountIn'].value
    );
    formData.append(
      'deductibleIn',
      this.claimsFollowUpDetailForm.controls['deductibleIn'].value
    );
    formData.append(
      'coinsuranceIn',
      this.claimsFollowUpDetailForm.controls['coinsuranceIn'].value
    );
    formData.append(
      'amountIndemnizedIn',
      this.claimsFollowUpDetailForm.controls['amountIndemnizedIn'].value
    );
    formData.append(
      'dateIndemnizationIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value !=
          null
          ? this.claimsFollowUpDetailForm.controls['dateIndemnizationIn'].value
          : ''
      )
    );
    formData.append(
      'shapeConclusionIn',
      this.claimsFollowUpDetailForm.controls['shapeConclusionIn'].value
    );
    formData.append(
      'letterClaimIn',
      this.convertDate(
        this.claimsFollowUpDetailForm.controls['letterClaimIn'].value != null
          ? this.claimsFollowUpDetailForm.controls['letterClaimIn'].value
          : ''
      )
    );
    formData.append(
      'orderOfEntryIn',
      this.claimsFollowUpDetailForm.controls['orderOfEntryIn'].value
    );
    formData.append(
      'firstSecondLaterIn',
      this.claimsFollowUpDetailForm.controls['firstSecondLaterIn'].value
    );
    formData.append(
      'statusIn',
      this.claimsFollowUpDetailForm.controls['statusIn'].value
    );
    this.seraLogService.postSaveSinisterRecord(formData).subscribe({
      next: resp => {
        if (resp.data) {
          this.handleSuccess();
        }
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
    const dateString: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    return dateString;
  }
  dateConvert(date: string): Date {
    if (date != 'null' && date != undefined) {
      console.log(date);
      const dates = new Date(date);
      const datePipe = new DatePipe('en-US');
      const formatTrans = datePipe.transform(dates, 'dd/MM/yyyy', 'UTC');
      const partesFecha1 = formatTrans.split('/');
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
