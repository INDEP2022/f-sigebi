import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import {
  IComerLot,
  IGoodPhoto,
} from 'src/app/core/models/ms-parametercomer/parameter';

import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { PublicationPhotographsService } from 'src/app/core/services/ms-parametercomer/publication-photographs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GoodPhoto,
  Lot,
  PUBLICATION_PHOTO1,
  PUBLICATION_PHOTO2,
} from './publication-photographs-columns';

@Component({
  selector: 'app-publication-photographs',
  templateUrl: './publication-photographs.component.html',
  styles: [
    `
      .float-check {
        position: absolute;
        top: -10px;
        right: -10px;
      }
    `,
  ],
})
export class PublicationPhotographsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  dataBatch: any;
  transform: number;
  selectedIndex = 0;
  lot: IComerLot;
  see: boolean;
  lotList: IComerLot[] = [];
  photography: IGoodPhoto;
  photographyList: IGoodPhoto[] = [];
  subtype: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  batchList: any;
  selectedCve: any = null;
  cveItems = new DefaultSelect();
  totalItems: number = 0;
  totalItemsL: number = 0;
  data1: LocalDataSource = new LocalDataSource();
  // dataAllotment = DATA;
  idLot: number = 0;
  data2: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  rowAllotment: string = null;
  selectedRow: any = null;

  rowSelectedGood: boolean = false;

  settings1;
  settings2;
  settings3;
  settings4;

  columns: any[] = [];
  @Output() refresh = new EventEmitter<true>();
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerLotService: ComerLotService,
    private publicationPhotographsService: PublicationPhotographsService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: { ...PUBLICATION_PHOTO1 },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...PUBLICATION_PHOTO2 },
    };

    this.settings4 = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...Lot },
      noDataMessage: 'No se encontrarón registros',
    };

    this.settings3 = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...GoodPhoto },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    // this.getCve({ page: 1, text: '' });
    // this.data1.load(this.dataBatch)
    this.prepareForm();
    this.see = true;
    // this.getAllLot();
    // this.getAllPhotoGood();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      address: [null],
      failureDate: [null],
      place: [null],
      location: [null],
    });
  }

  //  getCve(params: ListParams) {
  //     if (params.text == '') {
  //       this.cveItems = new DefaultSelect(this.data, 3);
  //     } else {
  //       const id = parseInt(params.text);
  //       const item = [this.data.filter((i: any) => i.id == id)];
  //       this.cveItems = new DefaultSelect(item[0], 1);
  //     }
  //   }

  selectCve(event: any) {
    this.selectedCve = event;
  }

  selectRow(row: any) {
    this.data2.load(row.numStore); //Sub
    this.data2.refresh();
    this.rowAllotment = row.id; //primary
    this.rowSelected = true;
  }

  selectRowGood() {
    this.rowSelectedGood = true;
  }

  findEvent(x: any) {
    // this.form.value.price = this.form.controls['price'].value;
    let eventId = x.id;
    if (this.form.value.eventId !== null) {
      this.comerLotService.getById(eventId).subscribe({
        next: data => {
          this.see = false;
          console.log(data);
          this.form.controls['id'].setValue(x.id);
          this.form.controls['address'].setValue(x.address);
          this.form.controls['failureDate'].setValue(x.failureDate);
          this.form.controls['place'].setValue(x.place);
          this.form.controls['location'].setValue(x.location);
          this.loading = false;
        },
        error: error => console.error,
      });
    }
  }

  getAllLot() {
    this.comerLotService.getAll().subscribe({
      next: data => {
        this.lotList = data.data;
        this.totalItems = data.count;
        console.log(this.lotList);
        this.loading = false;
        this.see = false;
      },
      error: error => (this.loading = false),
    });
  }
  getAllPhotoGood() {
    this.publicationPhotographsService.getAll().subscribe({
      next: data => {
        this.photographyList = data.data;
        this.totalItems = data.count;
        console.log(this.photographyList);
        this.loading = false;
      },
      error: error => (this.see = false),
    });
  }

  getById() {
    this.comerLotService.getById(this.idLot).subscribe({
      next: data => {
        this.lot = data.data;
        console.log(this.lot);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  userRowSelect(event: any) {
    this.lot = event.data.id;
    console.log(this.lot);
    // this.comerLotService.getById(this.lot).subscribe({
    //   next: data => {
    //     this.lotList = data.data;
    //     this.totalItems = data.count;
    //     console.log(this.lotList);
    //     this.loading = false;
    //   },
    //   error: error => (this.loading = false),
    // });
  }

  // getAllGoodPhoto() {
  //   this.comerLotService.getById(this.lot).subscribe({
  //     next: data => {
  //       this.lotList = data.data;
  //       this.totalItems = data.count;
  //       console.log(this.lotList);
  //       this.loading = false;
  //     },
  //     error: error => (this.loading = false),
  //   });
  // }

  // openForm(provider?: IPhotographMedia) {
  //   const modalConfig = MODAL_CONFIG;
  //   modalConfig.initialState = {
  //     provider,
  //     callback: (next: boolean) => {
  //       if (next) this.getBatch();
  //     },
  //   };
  //   this.modalService.show(PublicationPhotographsModalComponent, modalConfig);
  // }

  // openModal(context?: Partial<PublicationPhotographsModalComponent>) {
  //   const modalRef = this.modalService.show(
  //     PublicationPhotographsModalComponent,
  //     {
  //       initialState: { ...context },
  //       class: 'modal-lg modal-dialog-centered',
  //       ignoreBackdropClick: true,
  //     }
  //   );
  // }

  // showDeleteAlert(id: number) {
  //   this.alertQuestion(
  //     'warning',
  //     'Eliminar',
  //     'Desea eliminar este registro?'
  //   ).then(question => {
  //     if (question.isConfirmed) {
  //       this.photographMediaService.remove(id).subscribe({
  //         next: data => {
  //           this.loading = false;
  //           this.onLoadToast('success', 'Layout eliminado', '');
  //           this.getBatch();
  //         },
  //         error: error => {
  //           this.onLoadToast('error', 'No se puede eliminar registro', '');
  //           this.loading = false;
  //         },
  //       });
  //     }
  //   });
  // }

  //Carrusel de fotografías
  itemsPerSlide = 5;
  singleSlideOffset = true;

  // slides = [
  //   {
  //     image:
  //       'https://i.pinimg.com/originals/b5/32/5b/b5325b470c543806ab38376946d194c0.jpg',
  //   },
  //   {
  //     image:
  //       'https://i.pinimg.com/originals/55/da/25/55da25dd5c6763f54f72e525c4462c18.jpg',
  //   },
  //   {
  //     image:
  //       'https://i.pinimg.com/originals/25/19/12/251912a9122dce982d4f9a4c4f7a3360.jpg',
  //   },
  //   {
  //     image:
  //       'https://i.pinimg.com/originals/8a/88/81/8a88817c9c7702d4cecf14f84e601158.jpg',
  //   },
  //   {
  //     image:
  //       'https://cdn.dealeraccelerate.com/premier/19/5096/92829/1920x1440/1984-chevrolet-silverado-k10-4x4-pickup',
  //   },
  //   {
  //     image:
  //       'https://bringatrailer.com/wp-content/uploads/2022/01/1984_chevrolet_k10_20210909_180334-Copy-100030.jpg?fit=940%2C626',
  //   },
  // ];
}
