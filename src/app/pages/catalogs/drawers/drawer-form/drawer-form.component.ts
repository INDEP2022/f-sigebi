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
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
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
  title = 'gaveta';
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
      noDrawer: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      noBobeda: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.maxLength(2)]],
      noRegistration: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
    });

    if (this.drawer != null) {
      this.edit = true;
      let bobeda: ISafe = this.drawer.noBobeda as ISafe;
      this.drawerForm.patchValue({ ...this.drawer, noBobeda: bobeda.idSafe });
      this.boveda = new DefaultSelect([bobeda], 1);
      this.drawerForm.get('noDrawer').disable();
    } else {
      this.getBovedaSelect({ page: 1, text: '' });
    }
  }

  getBovedaSelect(params: ListParams) {
    this.safeService.getAll(params).subscribe(data => {
      this.boveda = new DefaultSelect(data.data, data.count);
    });

    this.boveda.data.find(data => {
      return data.id;
    });
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;

    this.drawerService.create(this.drawerForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    let { noDrawer, noBobeda } = this.drawer;
    const idBobeda = (noBobeda as ISafe).idSafe;
    noBobeda = idBobeda;
    this.drawerService
      .updateByIds({ noDrawer, noBobeda }, this.drawerForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
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
