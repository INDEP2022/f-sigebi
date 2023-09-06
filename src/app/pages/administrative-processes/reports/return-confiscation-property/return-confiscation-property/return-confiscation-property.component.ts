import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
@Component({
  selector: 'app-return-confiscation-property',
  templateUrl: './return-confiscation-property.component.html',
  styles: [],
})
export class ReturnConfiscationPropertyComponent
  extends BasePage
  implements OnInit
{
  returnConfiscationForm: ModelForm<any>;
  proceduralHistoryForm: ModelForm<any>;
  descripcion: any;
  idsubdelegation: any;
  iddelegation: any;

  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private GoodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.returnConfiscationForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
      receiptDateOf: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
      movementType: [null, Validators.required],
    });
  }

  seleccionarSubDelegacion(subdelegacion: any) {
    console.log('object ', subdelegacion);
    this.descripcion = subdelegacion.description;
    this.idsubdelegation = subdelegacion.id;
  }
  seleccionarDelegation(event: IDelegation) {
    console.log('event ', event);
    this.iddelegation = event.id;
    console.log('delegation ', event, 'this.iddelegation ', this.iddelegation);
  }

  validaGood() {
    let good1 = this.returnConfiscationForm.get('ofTheGood').value;
    let good2 = this.returnConfiscationForm.get('toGood').value;
    this.GoodService.getGoodByNoGood(good1).subscribe({
      next: response => {
        this.GoodService.getGoodByNoGood(good2).subscribe({
          next: response => {
            this.PupLanzaReporte();
          },
          error: err => {
            this.alert(
              'error',
              'Error',
              'El No. de Bien Final no Existe, Favor de Verificar.'
            );
          },
        });
      },
      error: err => {
        this.alert(
          'error',
          'Error',
          'El No. de Bien Inicial no Existe, Favor de Verificar.'
        );
      },
    });
  }

  PupLanzaReporte() {
    const Desde =
      this.returnConfiscationForm.get('receiptDateOf').value != null
        ? new Date(this.returnConfiscationForm.get('receiptDateOf').value)
        : null;
    const formattedfecDesde = Desde != null ? this.formatDate(Desde) : null;

    const Hasta =
      this.returnConfiscationForm.get('receptionDateTo').value != null
        ? new Date(this.returnConfiscationForm.get('receptionDateTo').value)
        : null;
    const formattedfecHasta = Hasta != null ? this.formatDate(Hasta) : null;

    let params = {
      pn_delegation: this.iddelegation,
      pn_subdelegation: this.idsubdelegation,
      pn_nobien_ini: this.returnConfiscationForm.get('ofTheGood').value,
      pn_nobien_fin: this.returnConfiscationForm.get('toGood').value,
      para_desde: formattedfecDesde,
      para_hasta: formattedfecHasta,
      para_tipo_devolucion:
        this.returnConfiscationForm.get('movementType').value,
    };
    console.log('params ', params);
    //reporte RGERADBDEVDECBIEN
    this.siabService.fetchReport('blank', params).subscribe({
      next: res => {
        if (res !== null) {
          const blob = new Blob([res], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([res], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      },
      error: (error: any) => {
        console.log('error', error);
      },
    });
  }
  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  clearAll() {
    this.returnConfiscationForm.reset();
  }
}
