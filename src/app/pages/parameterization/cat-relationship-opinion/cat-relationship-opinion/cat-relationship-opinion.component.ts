import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { OpinionsListComponent } from 'src/app/pages/catalogs/opinions/opinions-list/opinions-list.component';
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
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';

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
  data2: LocalDataSource = new LocalDataSource();
  form: FormGroup = new FormGroup({});

  affairTypesList: IAffairType[] = [];
  rAsuntDicList: IRAsuntDic[] = [];
  affairTypes: IAffairType;

  id: IAffair;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  settings2;

  dataRAsuntDic: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private affairService: AffairService,
    private affairTypeService: AffairTypeService,
    private modalService: BsModalService,
    private RAsuntDicService: RAsuntDicService
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
    // this.form = this.fb.group({
    //   code: [null, [Validators.required]],
    //   dictum: [null, [Validators.required]],
    //   flyerType: [null, [Validators.required]],
    // });
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
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRAsuntDic());
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

  getRAsuntDic() {
    let _id = this.affairForm.controls['id'].value;
    this.loading = true;
    this.RAsuntDicService.getByCode(_id).subscribe({
      next: response => {
        console.log(response);
        this.rAsuntDicList = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = 'encontrado';
    this.onLoadToast('success', this.form.value, `${message} Correctamente`);
    this.loading = false;
  }

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
    this.modalService.show(OpinionsListComponent, config);
  }
}
