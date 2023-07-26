import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IEdosXCoor } from 'src/app/core/models/catalogs/edos-x-coor.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EdosXCoorService } from 'src/app/core/services/catalogs/edos-x-coor.service';
import { StageService } from 'src/app/core/services/catalogs/stage.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-edos-x-coor-form',
  templateUrl: './edos-x-coor-form.component.html',
  styles: [],
})
export class EdosXCoorFormComponent extends BasePage implements OnInit {
  //edosXCoorForm: ModelForm<IEdosXCoor>;
  edosXCoorForm: FormGroup = new FormGroup({});
  title: string = 'Estado por Coordinación';
  edit: boolean = false;
  edosXCoor: IEdosXCoor;
  delegations: IDelegation;
  delegationsSelected = new DefaultSelect();
  stateSelected = new DefaultSelect();
  stateKey: string = '';
  noState: string = '';
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private edosXCoorService: EdosXCoorService,
    private stageService: StageService,
    private delegationService: DelegationService,
    private stateOfRepublicService: StateOfRepublicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.edosXCoorForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      noState: [null],
      state: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      stage: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(20)],
      ],
    });
    if (this.edosXCoor != null) {
      this.edit = true;
      console.log(this.edosXCoor.id);
      //this.edosXCoorForm.controls['id'].setValue(this.edosXCoor.id);
      this.getSelectDelegations(new ListParams(), this.edosXCoor.id);
      this.getSelectState(new ListParams(), this.edosXCoor.noState);
      this.edosXCoorForm.controls['id'].disable();
      this.edosXCoorForm.controls['noState'].disable();
      this.edosXCoorForm.controls['stage'].disable();
      this.edosXCoorForm.patchValue(this.edosXCoor);
    }
    this.getDelegations(new ListParams());
    this.getState(new ListParams());
    this.edosXCoorForm.controls['stage'].disable();
  }

  getDelegations(params: ListParams) {
    console.log(this.edosXCoorForm.controls['id'].value);
    params['filter.description'] = `$ilike:${this.stateKey}`;
    this.delegationService.getAll(params).subscribe({
      next: data => {
        this.delegationsSelected = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.delegationsSelected = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getSelectDelegations(params: ListParams, value: number) {
    console.log(this.edosXCoorForm.controls['id'].value);
    params['filter.id'] = `$eq:${value}`;
    this.delegationService.getAll(params).subscribe({
      next: data => {
        this.delegationsSelected = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.delegationsSelected = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getChange(data: any) {
    console.log(data);
    if (data.id != null) {
      const id = data.id;
      const noState = data.stateKey;
      const stage = data.etapaEdo;
      //this.edosXCoorForm.controls['noState'].setValue(parseInt(noState));
      this.edosXCoorForm.controls['stage'].setValue(parseInt(stage));
    }
  }

  getState(params: ListParams) {
    console.log(this.edosXCoorForm.controls['id'].value);
    params['filter.descCondition'] = `$ilike:${this.noState}`;
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => {
        this.stateSelected = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.stateSelected = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getChangeState(data: any) {}

  getSelectState(params: ListParams, value: string) {
    console.log(this.edosXCoorForm.controls['id'].value);
    params['filter.id'] = `$eq:${value}`;
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => {
        this.stateSelected = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.stateSelected = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.edosXCoorForm.controls['description'].value.trim() == '' ||
      this.edosXCoorForm.controls['state'].value.trim() == '' ||
      (this.edosXCoorForm.controls['description'].value.trim() == '' &&
        this.edosXCoorForm.controls['state'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      const id = this.edosXCoorForm.controls['id'].value;
      this.edosXCoorForm.controls['id'].setValue(parseInt(id));
      this.edosXCoorService.create(this.edosXCoorForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.edosXCoorForm.controls['description'].value.trim() == '' ||
      this.edosXCoorForm.controls['state'].value.trim() == '' ||
      (this.edosXCoorForm.controls['description'].value.trim() == '' &&
        this.edosXCoorForm.controls['state'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      /*const id = this.edosXCoorForm.controls['id'].value;
      const noState = this.edosXCoorForm.controls['noState'].value;
      const stage = this.edosXCoorForm.controls['stage'].value;
      this.edosXCoorForm.controls['id'].setValue(parseInt(id));
      this.edosXCoorForm.controls['noState'].setValue(parseInt(noState));
      this.edosXCoorForm.controls['stage'].setValue(parseInt(stage));*/
      const id = this.edosXCoorForm.controls['id'].value;
      this.edosXCoorForm.controls['id'].setValue(parseInt(id));
      this.edosXCoorService
        .newUpdate(this.edosXCoorForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
