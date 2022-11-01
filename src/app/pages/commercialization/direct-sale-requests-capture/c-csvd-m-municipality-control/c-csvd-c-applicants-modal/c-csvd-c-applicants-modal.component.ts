import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-c-csvd-c-applicants-modal',
  templateUrl: './c-csvd-c-applicants-modal.component.html',
  styles: [],
})
export class CCsvdCApplicantsModalComponent extends BasePage implements OnInit {
  title: string = 'Solicitante';
  applicant: any;
  positions: number[] = [];
  edit: boolean = false;
  municipalityItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  applicantForm: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<any>();

  municipalityTestData = [
    {
      id: 1,
      description: 'MUNICIPIO 1',
    },
    {
      id: 2,
      description: 'MUNICIPIO 2',
    },
    {
      id: 3,
      description: 'MUNICIPIO 3',
    },
    {
      id: 4,
      description: 'MUNICIPIO 4',
    },
    {
      id: 5,
      description: 'MUNICIPIO 5',
    },
  ];

  stateTestData = [
    {
      id: 1,
      description: 'ESTADO 1',
    },
    {
      id: 2,
      description: 'ESTADO 2',
    },
    {
      id: 3,
      description: 'ESTADO 3',
    },
    {
      id: 4,
      description: 'ESTADO 4',
    },
    {
      id: 5,
      description: 'ESTADO 5',
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getMunicipalities({ inicio: 1, text: '' });
    this.getStates({ inicio: 1, text: '' });
  }

  private prepareForm(): void {
    this.applicantForm = this.fb.group({
      entityId: [null, [Validators.required]],
      applicant: [null, [Validators.required]],
      position: [null, [Validators.required]],
      municipality: [null, [Validators.required]],
      state: [null, [Validators.required]],
      applicationDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      phone: [null],
      adjudication: [null, [Validators.required]],
      email: [null],
    });
    if (this.applicant !== undefined) {
      this.edit = true;
      this.applicantForm.patchValue(this.applicant);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onConfirm.emit(this.applicantForm.value);
    this.modalRef.hide();
  }

  getMunicipalities(params: ListParams) {
    if (params.text == '') {
      this.municipalityItems = new DefaultSelect(this.municipalityTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.municipalityTestData.filter((i: any) => i.id == id)];
      this.municipalityItems = new DefaultSelect(item[0], 1);
    }
  }

  getStates(params: ListParams) {
    if (params.text == '') {
      this.stateItems = new DefaultSelect(this.stateTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.stateTestData.filter((i: any) => i.id == id)];
      this.stateItems = new DefaultSelect(item[0], 1);
    }
  }
}
