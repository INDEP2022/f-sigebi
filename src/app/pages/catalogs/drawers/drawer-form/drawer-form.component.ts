import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IDrawer } from 'src/app/core/models/catalogs/drawer.model';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { DrawerService } from 'src/app/core/services/catalogs/drawer.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalService: BsModalRef,
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
      noDrawer: [null, [Validators.required, Validators.maxLength(3)]],
      noBobeda: [
        null,
        [Validators.required, Validators.pattern('[0-9]{0,255}')],
      ],
      status: [null, [Validators.required, Validators.maxLength(2)]],
      noRegistration: [null, [Validators.required, Validators.maxLength(10)]],
    });

    if (this.drawer != null) {
      this.edit = true;
      this.drawerForm.patchValue(this.drawer);

      if (this.drawer.noBobeda) {
        this.drawerForm.controls.noBobeda.setValue(
          (this.drawer.noBobeda as ISafe).idSafe
        );
        this.boveda = new DefaultSelect([this.drawer.noBobeda], 1);
      }
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

    this.drawerService.create(this.drawerForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    let { noDrawer, noBobeda } = this.drawer;
    const idBobeda = (noBobeda as ISafe).idSafe;
    noBobeda = idBobeda;
    this.drawerService
      .updateByIds({ noDrawer, noBobeda }, this.drawerForm.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }

  close() {
    this.modalService.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalService.hide();
  }
}
