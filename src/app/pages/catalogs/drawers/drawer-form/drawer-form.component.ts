import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDrawer } from 'src/app/core/models/catalogs/drawer.model';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { DrawerService } from 'src/app/core/services/catalogs/drawer.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-drawer-form',
  templateUrl: './drawer-form.component.html',
  styles: [],
})
export class DrawerFormComponent extends BasePage implements OnInit {
  drawer: IDrawer;
  edit: boolean = false;
  drawerForm: ModelForm<IDrawer>;
  idBoveda: number = 0;
  boveda = new DefaultSelect<ISafe>();
  title = 'Gaveta';
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private drawerService: DrawerService,
    private safeService: SafeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.drawerForm = this.fb.group({
      id: [null],
      noDrawer: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.max(99999),
        ],
      ],
      status: [
        null,
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      noRegistration: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });

    if (this.drawer != null) {
      this.edit = true;
      let boveda: ISafe = this.drawer.noDrawer as ISafe;
      this.drawerForm.patchValue({ ...this.drawer, noDrawner: boveda.idSafe });
      console.log(this.drawerForm.value);

      this.drawerForm.controls['id'].setValue(this.drawer.id);
      this.drawerForm.get('noDrawer').disable();
      this.drawerForm.get('id').disable();
      this.getBoveda(new ListParams(), this.drawerForm.get('noDrawer').value);
    } else {
      this.drawerForm.get('id').disable();
      this.getBoveda(new ListParams());
    }
  }
  getBoveda(params: ListParams, id?: string) {
    if (id) {
      params['filter.idSafe'] = id;
    }
    this.safeService.getAll(params).subscribe(data => {
      this.boveda = new DefaultSelect(data.data, data.count);
    });
  }

  bovedaChange(boveda: ISafe) {}

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.drawerForm.controls['status'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.drawerService.create(this.drawerForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (this.drawerForm.controls['status'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      let { id, noDrawer } = this.drawer;
      const idBoveda = (noDrawer as ISafe).idSafe;
      let body = {
        id,
        noDrawer,
        status: this.drawerForm.value.status,
        noRegistration: this.drawerForm.value.noRegistration,
      };
      this.drawerService.updateById(id, body).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
