import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS, COLUMNS2 } from './columns';
//Components
import { BrandsSubBrandsFormComponent } from '../brands-sub-brands-form/brands-sub-brands-form.component';
//Provisional Data
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { BrandsSubBrandsService } from '../brands-sub-brands.service';
import { DATA } from './data';

@Component({
  selector: 'app-brands-sub-brands-list',
  templateUrl: './brands-sub-brands-list.component.html',
  styles: [],
})
export class BrandsSubBrandsListComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  dataBrands = DATA;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data2: LocalDataSource = new LocalDataSource();
  //dataSubBrands: any = [];
  settings2;
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  rowBrand: string = null;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private brandService: BrandsSubBrandsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: COLUMNS2,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchParams();
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

  searchParams() {
    this.params.subscribe({
      next: resp => {
        this.dataBrands = [];
        if (resp.text !== '') {
          this.brandService.getBrandsForId(resp.text).subscribe({
            next: (searchBrand: any) => {
              if (searchBrand) {
                this.dataBrands.push({
                  brand: searchBrand.id,
                  description: searchBrand.brandDescription,
                  subbrands: [],
                });

                this.brandService.getSubBrands().subscribe({
                  next: (brandSub: any) => {
                    brandSub.data.forEach((item: any) => {
                      this.dataBrands.forEach(data => {
                        if (item.idBrand.id === data.brand) {
                          data.subbrands.push({
                            subBrand: item.idSubBrand,
                            description: item.subBrandDescription || '-',
                          });
                        }
                      });
                    });
                    this.data.load(this.dataBrands);
                  },
                });
              }
            },
          });
        } else {
          this.getComerBrands();
        }
      },
    });
  }

  getComerBrands() {
    this.dataBrands = [];
    this.brandService.getBrands().subscribe({
      next: (brands: any) => {
        if (brands) {
          brands.data.forEach((item: any) => {
            this.dataBrands.push({
              brand: item.id,
              description: item.brandDescription,
              subbrands: [],
            });
          });

          this.brandService.getSubBrands().subscribe({
            next: (brandSub: any) => {
              brandSub.data.forEach((item: any) => {
                this.dataBrands.forEach(data => {
                  if (item.idBrand.id === data.brand) {
                    data.subbrands.push({
                      subBrand: item.idSubBrand,
                      description: item.subBrandDescription || '-',
                    });
                  }
                });
              });
              this.data.load(this.dataBrands);
            },
          });
        }
      },
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
        this.getComerBrands();
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
        // this.brandService.deleteBrandsForId(brand.brand)
      }
    });
  }

  selectRow(row: any) {
    this.data2.load(row.subbrands);
    this.data2.refresh();
    this.rowBrand = row.brand;
    this.rowSelected = true;
  }
}
