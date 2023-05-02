import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { COLUMNS } from './columns';
//Components
import { BrandsSubBrandsFormComponent } from '../brands-sub-brands-form/brands-sub-brands-form.component';
//Provisional Data
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-brands-sub-brands-list',
  templateUrl: './brands-sub-brands-list.component.html',
  styles: [],
})
export class BrandsSubBrandsListComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  //dataSubBrands: any = [];
  // settings2;
  rowBrand: string = null;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private brandService: ParameterBrandsService
  ) {
    super();
    this.service = this.brandService;
    // this.ilikeFilters = ['brandDescription'];
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
    this.prepareForm();
    // this.settings2 = {
    //   ...this.settings,
    //   actions: false,
    //   columns: COLUMNS2,
    // };
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      brand: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  openModal(context?: Partial<BrandsSubBrandsFormComponent>) {
    const modalRef = this.modalService.show(BrandsSubBrandsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getData();
      } //this.getCities();
    });
  }

  add() {
    this.openModal();
  }

  openForm(brand: any) {
    this.openModal({ edit: true, brand });
  }

  deleteBrand(brand: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        // (delete)="deleteBrand($event.data)" (html)
        //este es el subcribe para eliminar
        this.brandService.remove(brand.id).subscribe({
          next: response => {
            this.getData();
          },
          error: err => {},
        });
      }
    });
  }

  selectRow(row: any) {
    console.log(row);
    // this.subBrandService.getAll('?filter.idBrand=$eq:' + row.id).subscribe({
    //   next: response => {
    //     this.data2.load(response.data);
    //     this.data2.refresh();
    //     this.totalItems2 = response.count || 0;
    //     this.loading2 = false;
    //   },
    //   error: err => {
    //     this.data2.load([]);
    //     this.data2.refresh();
    //     this.loading2 = false;
    //   },
    // });
    this.rowBrand = row.id;
  }
}
