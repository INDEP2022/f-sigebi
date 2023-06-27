import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-acta-convertion-form',
  templateUrl: './acta-convertion-form.component.html',
  styleUrls: ['./acta-convertion.component.scss'],
})
export class ActaConvertionFormComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  edit: boolean = false;
  delegation: any;
  states = new DefaultSelect<IStateOfRepublic>();
  zones = new DefaultSelect<IZoneGeographic>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  /*create() {
    this.loading = true;
    this.delegationService.create(this.delegationForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }*/

  items = [
    { id: 1, nombre: 'Item 1' },
    { id: 2, nombre: 'Item 2' },
  ];
  selectedItems: any[] = [];
  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      this.selectedItems.push(item);
    } else {
      for (var i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i].id === item.id) {
          this.selectedItems.splice(i, 1);
        }
      }
    }
  }

  imprimirFolioEscaneo() {
    // if (this.dictamen) {
    /* if (this.dictamen.folioUniversal == null) {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
      return;
    } else {
      let params = {
        pn_folio: this.dictamen.folioUniversal,
      };
      // let params = {
      //   pn_folio: 3429518,
      // };
      this.siabService
        .fetchReport('RGERGENSOLICDIGIT', params)
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.onLoadToast('success', '', 'Reporte generado');
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }*/
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  visualizacionFolioEscaneo() {
    // if (this.dictamen) {
    /*if (this.dictamen.folioUniversal == null) {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
      return;
    } else {
      this.goNextForm();
    }*/
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  imgSolicitud() {
    // if (this.oficioDictamen && this.dictamen) {
    /*  if (
      this.oficioDictamen.statusOf == 'ENVIADO' &&
      this.dictamen.passOfficeArmy != null
    ) {
      if (this.dictamen.folioUniversal != null) {
        this.alert('warning', 'El acta ya tiene folio de escaneo', '');
        return;
      } else {
        this.alertQuestion(
          'info',
          'Se generará un nuevo folio de escaneo para la declaratoria',
          '¿Deseas continuar?'
        ).then(question => {
          if (question.isConfirmed) {
            this.generarFolioEscaneo();
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'No se puede generar el folio de escaneo en una declaratoria abierta',
        ''
      );
    }*/
    // } else {
    // this.alert(
    //   'info',
    //   'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //   ''
    // );
    // }
  }

  escanearFolioEscaneo() {
    // if (this.oficioDictamen && this.dictamen) {
    /*if (
      this.oficioDictamen.statusOf == 'ENVIADO' &&
      this.dictamen.passOfficeArmy != null
    ) {
      if (this.folioEscaneoNg != '') {
        this.alertQuestion(
          'info',
          'Se abrirá la pantalla de escaneo para el folio de escaneo de la declaratoria',
          '¿Deseas continuar?',
          'Continuar'
        ).then(question => {
          if (question.isConfirmed) {
            // this.onLoadToast('success', 'Enviado a la siguiente forma', '');

            this.goNextForm();
          }
        });
      } else {
        this.alert('error', 'No existe folio de escaneo a escanear', '');
      }
    } else {
      this.alert(
        'error',
        'No se puede escanear para una declaratoria que esté abierta',
        ''
      );
    }*/
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }
}
