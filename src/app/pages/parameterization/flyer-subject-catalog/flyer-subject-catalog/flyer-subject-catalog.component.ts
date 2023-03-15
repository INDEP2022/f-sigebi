import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AFFAIR_COLUMNS } from './affair-column';
import { AFFAIR_TYPE_COLUMNS } from './affair-type-column';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//service
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { FlyerSubjectCatalogModelComponent } from '../flyer-subject-catalog-model/flyer-subject-catalog-model.component';

@Component({
  selector: 'app-flyer-subject-catalog',
  templateUrl: './flyer-subject-catalog.component.html',
  styles: [],
})
export class FlyerSubjectCatalogComponent extends BasePage implements OnInit {
  affairList: IAffair[] = [];
  affairTypeList: IAffairType[] = [];
  affairs: IAffair;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();

  rowSelected: boolean = false;
  selectedRow: any = null;

  id: any;

  settings2;

  constructor(
    private affairTypeService: AffairTypeService,
    private affairService: AffairService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private r2: Renderer2
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...AFFAIR_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...AFFAIR_TYPE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAffairAll();
      this.getAffairType(this.id);
    });
  }

  getAffairAll() {
    this.loading = true;

    this.affairService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.affairList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.affairTypeList = [];
    this.affairs = event.data;
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAffairType(this.affairs);
      const btn = document.getElementById('btn-new');
      this.r2.removeClass(btn, 'disabled');
      this.id = this.affairs;
      console.log(this.id);
    });
  }

  getAffairType(affair: IAffair) {
    this.loading = true;
    this.affairTypeService
      .getAffairTypeById(affair.id, this.params2.getValue())
      .subscribe({
        next: response => {
          this.affairTypeList = response.data;
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  openForm(affairType?: IAffairType) {
    const idF = { ...this.affairs };
    let affair = this.affairs;
    let config: ModalOptions = {
      initialState: {
        affairType,
        affair,
        idF,
        callback: (next: boolean) => {
          if (next) this.getAffairType(this.id);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FlyerSubjectCatalogModelComponent, config);
  }
}
