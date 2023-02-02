import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatRelationshipOpinionModalComponent } from '../cat-relationship-opinion-modal/cat-relationship-opinion-modal.component';
import {
  AFFAIR_TYPE_COLUMNS,
  DICTA_COLUMNS,
} from './relationship-opinion-columns';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
//Services
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { CustomerCatalogsTableComponent } from 'src/app/pages/commercialization/shared-marketing-components/event-preparation/customer-catalogs-table/customer-catalogs-table.component';

@Component({
  selector: 'app-cat-relationship-opinion',
  templateUrl: './cat-relationship-opinion.component.html',
  styles: [],
})
export class CatRelationshipOpinionComponent
  extends BasePage
  implements OnInit
{
  affairForm: ModelForm<IAffair>;
  data: LocalDataSource = new LocalDataSource();

  affairTypeList: IAffairType[] = [];
  affairTypes: IAffairType;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  settings2;

  constructor(
    private fb: FormBuilder,
    private affairService: AffairService,
    private affairTypeService: AffairTypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...AFFAIR_TYPE_COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...DICTA_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.affairForm = this.fb.group({
      id: [null, [Validators.required]],
      description: [{ value: null, disabled: true }],
    });
  }

  //Llenar inputs con id de affair
  getAffairById(): void {
    let _id = this.affairForm.controls['id'].value;
    this.loading = true;
    this.affairService.getById(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.affairForm.patchValue(response);
          this.affairForm.updateValueAndValidity();
          this.getTypesByAffairId(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  //Traer datos a la tabla tipo de asuntos con id de asunto
  getTypesByAffairId(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairTypes(id));
  }

  getAffairTypes(id: string | number): void {
    this.affairTypeService.getByAffair(id, this.params.getValue()).subscribe(
      response => {
        //console.log(response);
        let data = response.data.map((item: IAffairType) => {
          return item;
        });
        this.data.load(data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  //Traer datos de r asunt tipo al seleccionar fila de la tabla tipo de asunto
  /*rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.affairTypeList = [];
    this.affairs = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairType(this.affairs));
  }*/

  openForm(rAsuntDic?: IRAsuntDic) {
    console.log(rAsuntDic);
    let affairType = this.affairTypes;
    let config: ModalOptions = {
      initialState: {
        rAsuntDic,
        affairType,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatRelationshipOpinionModalComponent, config);
  }

  openDictum() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CustomerCatalogsTableComponent, config);
  }

  data2 = [
    {
      code: 1,
      dictum: 2,
      flyerType: 1,
      doc: 1,
      property: 1,
      g_of: 1,
      i: 1,
      e: 1,
      registryNumber: 1,
    },
  ];
}
