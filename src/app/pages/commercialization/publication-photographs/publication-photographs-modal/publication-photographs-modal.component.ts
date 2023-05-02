import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPhoto } from 'src/app/core/models/ms-parametercomer/parameter';
import { PublicationPhotographsService } from 'src/app/core/services/ms-parametercomer/publication-photographs.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-publication-photographs-modal',
  templateUrl: './publication-photographs-modal.component.html',
  styles: [],
})
export class PublicationPhotographsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Fotografías';
  provider: any;
  imageSrc: any;
  photo: IPhoto;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  edit: boolean = false;
  providerForm: FormGroup = new FormGroup({});
  id: number = 0;
  pdfurl: string;
  file: any;
  photoList: IPhoto[] = [];

  @Output() onConfirm = new EventEmitter<any>();
  @Input() structureLayout: any;

  constructor(
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private publicationPhotographsService: PublicationPhotographsService
  ) {
    super();
  }
  ngOnInit(): void {
    this.prepareForm();
    // this.inpuPhoto = this.id.toString().toUpperCase();
  }

  private prepareForm() {
    this.providerForm = this.fb.group({
      route: [null, [Validators.required]],
      status: [null, [Validators.required]],
      id: [null],
      // noConsec: [null],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
    } else {
      this.edit = false;
    }
  }

  close() {
    this.modalRef.hide();
  }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  // create() {
  //   try {
  //     this.loading = false;
  //     this.publicationPhotographsService.create(this.photo).subscribe({
  //       next: data => {
  //         this.handleSuccess();
  //       },
  //       error: error => {
  //         this.loading = false;
  //         this.onLoadToast('error', 'No se puede duplicar layout!!', '');
  //         return;
  //       },
  //     });
  //   } catch {
  //     console.error('Layout no existe');
  //   }
  // }
  // update() {
  //   this.alertQuestion(
  //     'warning',
  //     'Actualizar',
  //     'Desea actualizar este layout?'
  //   ).then(question => {
  //     if (question.isConfirmed) {
  //       this.publicationPhotographsService
  //         .update(this.provider.id, this.providerForm.value)
  //         .subscribe({
  //           next: data => this.handleSuccess(),
  //           error: error => {
  //             this.onLoadToast(
  //               'error',
  //               'No se puede adjuntar éste tipo de arhivos',
  //               ''
  //             );
  //             this.loading = false;
  //           },
  //         });
  //     }
  //   });
  // }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    setTimeout(() => {
      this.onLoadToast('success', this.title, `${message} Correctamente`);
    }, 2000);
    this.loading = false;
    this.onConfirm.emit(true);
    this.modalRef.content.callback(true);
    this.close();
  }
  preview() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
