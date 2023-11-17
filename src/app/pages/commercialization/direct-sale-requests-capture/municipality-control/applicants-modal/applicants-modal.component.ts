import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Solicitud } from 'src/app/core/models/ms-directsale/solicitante';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { MunicipalityControlMainService } from 'src/app/core/services/ms-directsale/municipality-control-main.service';
import { TypeEntityGovService } from 'src/app/core/services/ms-parametercomer/type-entity-gov.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-applicants-modal',
  templateUrl: './applicants-modal.component.html',
  styles: [],
})
export class ApplicantsModalComponent extends BasePage implements OnInit {
  title: string = 'Solicitante';
  applicant: any;
  applicantColumns: any[] = [];
  positions: number[] = [];
  edit: boolean = false;
  municipalityItems = new DefaultSelect();
  typeEntityItems = new DefaultSelect();
  states: any[] = [];
  departments: any[] = [];
  stateItems = new DefaultSelect();
  applicantForm: FormGroup = new FormGroup({});
  applicantForm2: FormGroup = new FormGroup({});
  bodySolicitante: Solicitud;
  @Output() refresh = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private municipalityControlMainService: MunicipalityControlMainService,
    private delegationService: DelegationService,
    private typeEntityService: TypeEntityGovService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getMunicipalities(new ListParams());
    this.getStates(new ListParams());
    this.getTypeEntitiesGov(new ListParams());
    console.log(this.applicant);

    this.delegationService.getStates(new ListParams()).subscribe(data => {
      this.states = data.data;
      this.stateItems = new DefaultSelect(this.states, data.count);

      console.log(this.states);
    });
    this.delegationService.getAll(new ListParams()).subscribe(data => {
      this.departments = data.data;
      this.municipalityItems = new DefaultSelect(this.departments, data.count);
      console.log(this.departments);
    });
  }

  private prepareForm(): void {
    this.applicantForm = this.fb.group({
      soladjinstgobId: [null],
      typeentgobId: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      applicant: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      municipality: [null, [Validators.required, Validators.maxLength(70)]],
      state: [null, [Validators.required, Validators.maxLength(30)]],
      applicationDate: [null, [Validators.required]],
      amount: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      phone: [null], //[Validators.pattern(PHONE_PATTERN)]
      award: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      webmail: [null, Validators.pattern(EMAIL_PATTERN)],
    });
    this.applicantForm2 = this.fb.group({
      typeentgobId: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      applicant: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      municipality: [null, [Validators.required, Validators.maxLength(70)]],
      state: [null, [Validators.required, Validators.maxLength(30)]],
      applicationDate: [null, [Validators.required]],
      amount: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      phone: [null], //[Validators.pattern(PHONE_PATTERN)]
      award: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      webmail: [null, Validators.pattern(EMAIL_PATTERN)],
    });
    if (this.applicant !== undefined) {
      this.edit = true;
      this.applicantForm.patchValue(this.applicant);
      this.setValue();
    }
  }
  setValue() {
    if (this.applicantForm.value.typeentgobId) {
      this.edit = true;
      this.applicantForm.controls['typeentgobId'].setValue(
        this.applicantForm.controls['typeentgobId'].value.typeentgobId
      );
      this.applicantForm.controls['applicationDate'].setValue(
        new Date(this.applicantForm.value.applicationDate)
      );
    } else {
      this.edit = false;
    }
  }

  getTypeEntitiesGov(params: ListParams) {
    this.typeEntityService.getAllFilter(params).subscribe({
      next: resp => {
        resp.data.forEach((x: any) => {
          x['idDescription'] = x.id + ' - ' + x.description;
        });
        this.typeEntityItems = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  save() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.bodySolicitante = this.applicantForm.value;
    //console.log(this.bodySolicitante);
    if (this.edit) {
      this.municipalityControlMainService
        .updateSolicitante(this.bodySolicitante)
        .subscribe({
          next: data => {
            this.onLoadToast('success', 'Se ha modificado el solicitante', '');
            this.refresh.emit(true);
            this.close();

            // location.reload();
          },
          error: err => {
            this.onLoadToast(
              'warning',
              'advertencia',
              'El Solicitante no se ha Actualizado Correctamente'
            );
            this.close();
          },
        });
    } else {
      this.bodySolicitante = this.applicantForm.value;
      this.applicantForm2.patchValue(this.bodySolicitante);
      // console.log(JSON.stringify(this.applicantForm2.value));
      this.municipalityControlMainService
        .addSolicitante(this.applicantForm2.value)
        .subscribe({
          next: data => {
            this.onLoadToast('success', 'Se ha creado el solicitante', '');
            this.refresh.emit(true);
            this.close();
            //  location.reload();
          },
          error: err => {
            this.onLoadToast(
              'warning',
              'Advertencia',
              'El Bien no se ha Agragado Correctamente'
            );
            this.close();
          },
        });
    }
  }

  getMunicipalities(params?: ListParams) {
    if (params != undefined && params.text != '')
      params['filter.description'] = `$ilike:${params.text}`;
    this.delegationService.getAll(params).subscribe(data => {
      this.departments = data.data;
      this.municipalityItems = new DefaultSelect(this.departments, data.count);
      console.log(this.municipalityItems);
    });
  }

  municipalitiesChange(event: any) {
    if (event == undefined) {
      this.applicantForm.get('municipality').setValue(null);
      this.municipalityItems = new DefaultSelect();
      this.getMunicipalities(new ListParams());
    }
  }
  getStates(params?: ListParams) {
    if (params != undefined && params.text != '')
      params['filter.descCondition'] = `$ilike:${params.text}`;
    this.delegationService.getStates(params).subscribe(data => {
      this.states = data.data;
      this.stateItems = new DefaultSelect(this.states, data.count);
    });
  }

  stateItemsChange(event: any) {
    if (event == undefined) {
      this.applicantForm.get('state').setValue(null);
      this.stateItems = new DefaultSelect();
      this.getStates(new ListParams());
    }
  }
}
