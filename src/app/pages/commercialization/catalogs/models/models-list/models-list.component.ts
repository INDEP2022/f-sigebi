import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelsService } from '../models.service';
import { COLUMNS } from './columns';
//Components
//Provisional Data
import { DATA } from './data';

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styles: [],
})
export class ModelsListComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  // data: LocalDataSource = new LocalDataSource();
  dataBrands = DATA;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modelServices: ModelsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: true,
        edit: true,
        delete: true,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchParams();
  }

  searchParams() {
    this.params.subscribe({
      next: resp => {
        // this.dataBrands = [];
        if (resp.text !== '') {
          this.modelServices.getModels(resp.text).subscribe({
            next: brands => {
              // if (searchModel) {
              //   this.dataBrands.push({
              //     model: searchModel.id,
              //   });
              // }
              this.dataBrands = [...brands.data];
              this.totalItems = brands.count;
              // this.data.load(brands);
            },
          });
        } else {
          this.getModels();
        }
      },
    });
  }

  getModels() {
    // this.dataBrands = [];
    this.modelServices.getModels().subscribe({
      next: resp => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.dataBrands.push({
              model: item.id,
            });
          });
        }
        this.dataBrands = [...resp.data];
        this.totalItems = resp.count;
        // this.data.load(this.dataBrands);
      },
    });
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      brand: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  onSaveConfirm(event: any) {
    console.log(event);
    const body = {
      id: event.data.id,
      modelComment: event.newData.modelComment,
    };
    this.modelServices.PutModel(event.data.id, body).subscribe({
      next: (resp: any) => {
        if (resp.statusCode === 200) {
          event.confirm.resolve();
          this.onLoadToast('success', 'Elemento Actualizado', '');
          this.getModels();
        }
      },
    });
  }

  onAddConfirm(event: any) {
    console.log(event);
    const body = {
      id: event.newData.modelComment,
      modelComment: event.newData.modelComment,
    };
    this.modelServices.postModel(body).subscribe({
      next: (resp: any) => {
        if (resp) {
          event.confirm.resolve();
          this.onLoadToast('success', 'Elemento Creado', '');
          this.getModels();
        }
      },
    });
    /**
     * CALL SERVICE
     * */
  }

  onDeleteConfirm(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      console.log(event);
      if (question.isConfirmed) {
        this.modelServices.deleteModelForId(event.data.id).subscribe({
          next: (resp: any) => {
            event.confirm.resolve();
            this.onLoadToast('success', 'Elemento Eliminado', '');
            this.getModels();
          },
        });
      }
    });
  }

  /*openModal(context?: Partial<ModelsFormComponent>) {
    const modalRef = this.modalService.show(ModelsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next); //this.getCities();
    });
  }

  add() {
    this.openModal();
  }

  openForm(model: any) {
    this.openModal({ edit: true, model });
  }

  delete(model: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }*/
}
