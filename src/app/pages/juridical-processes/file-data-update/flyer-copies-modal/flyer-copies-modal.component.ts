import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilterParams } from '../../../../common/repository/interfaces/list-params';
import {
  IDeleteExternalEvent,
  IEditExternalEvent,
} from '../../../../core/interfaces/ng2-smart-table.interface';
import {
  FlyerPersontype,
  ICopiesxFlier,
} from '../../../../core/models/ms-flier/tmp-doc-reg-management.model';
import { IUserAccessAreaRelational } from '../../../../core/models/ms-users/seg-access-area-relational.model';
import { DocReceptionRegisterService } from '../../../../core/services/document-reception/doc-reception-register.service';
import { CopiesXFlierService } from '../../../../core/services/ms-flier/copies-x-flier.service';
import { BasePage } from '../../../../core/shared/base-page';
import { JURIDICAL_FILE_UPDATE_FLYER_COPIES_COLUMNS } from '../interfaces/columns';
import { AddEditFlyerCopyComponent } from './add-edit-flyer-copy/add-edit-flyer-copy.component';

interface userCopy extends IUserAccessAreaRelational, ICopiesxFlier {
  type: string;
}

@Component({
  selector: 'app-flyer-copies-modal',
  templateUrl: './flyer-copies-modal.component.html',
  styles: [
    `
      .heigth-limit {
        height: 22rem;
      }

      ng-scrollbar {
        ::ng-deep {
          .ng-scroll-viewport {
            padding-right: 1em;
            padding-bottom: 1em;
          }
        }
      }
    `,
  ],
})
export class FlyerCopiesModalComponent extends BasePage implements OnInit {
  title: string = 'Copias de Volante';
  notification: number;
  userReceipt: userCopy;
  selectedRow: userCopy;
  userCopies: userCopy[] = [];
  flyerCopies: ICopiesxFlier[] = [];
  addCopies: ICopiesxFlier[] = [];
  editedCopies: ICopiesxFlier[] = [];
  deletedCopies: { copyNumber: number; flierNumber: number }[] = [];
  columns: LocalDataSource = new LocalDataSource();
  copySettings = { ...this.settings };
  copyCounter: number;
  rowSelected: boolean = false;
  userAction: boolean = false;
  @Output() onSave = new EventEmitter<boolean>();
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private flyerCopiesService: CopiesXFlierService,
    private docRegisterService: DocReceptionRegisterService
  ) {
    super();
    this.copySettings = {
      ...this.settings,
      actions: { ...this.copySettings.actions, delete: true },
      selectedRowIndex: -1,
      columns: { ...JURIDICAL_FILE_UPDATE_FLYER_COPIES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    if (this.notification != undefined || this.notification != null) {
      this.loading = true;
      const param = new FilterParams();
      param.addFilter('flierNumber', this.notification);
      this.flyerCopiesService.getAllFiltered(param.getParams()).subscribe({
        next: data => {
          if (data.count > 0) {
            console.log(data);
            this.flyerCopies = data.data;
            this.getUsersData();
          }
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
        },
      });
    }
  }

  getUsersData() {
    this.flyerCopies.forEach(f => {
      const params = new FilterParams();
      params.addFilter('user', f.copyuser);
      this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            let type: string = 'C.P.P.';
            if (f.persontype == 'D') {
              type = 'DESTINATARIO';
              this.userReceipt = {
                ...data.data[0],
                ...f,
                type,
              };
            }
            this.userCopies.push({
              ...data.data[0],
              ...f,
              type,
            });
          }
        },
        error: () => {},
      });
    });
    setTimeout(async () => {
      if (this.userCopies.length > 1) {
        [...this.userCopies].reverse();
      }
      await this.columns.load([...this.userCopies]);
      this.columns.refresh();
      this.loading = false;
      this.copyCounter = this.userCopies.length + 1;
      const rows = await this.columns.getAll();
      console.log(this.columns.count(), rows);
    }, 1000);
  }

  async hasDataChanged() {
    const columns = await this.columns.getAll();
    console.log(columns, this.userCopies);
    if (JSON.stringify(this.userCopies) != JSON.stringify(columns)) {
      this.userAction = true;
    } else {
      this.userAction = false;
    }
  }

  addRow() {
    this.selectedRow = null;
    this.openModal({ edit: false });
  }

  editRow(event: IEditExternalEvent<userCopy>) {
    if (JSON.stringify(this.userReceipt) == JSON.stringify(event.data)) {
      this.alert(
        'warning',
        'No se puede editar destinatario',
        'Si desea editar destinatario, use la opción de reasignación de turno'
      );
      return;
    }
    this.selectedRow = event.data;
    this.openModal({ edit: true, copyEdit: this.selectedRow });
  }

  deleteRow(event: IDeleteExternalEvent<userCopy>) {
    if (JSON.stringify(this.userReceipt) == JSON.stringify(event.data)) {
      this.alert('warning', 'No se puede eliminar destinatario', '');
      return;
    }
    this.selectedRow = event.data;
    if (this.deletedCopies.length > 0) {
      const idx = this.deletedCopies.findIndex(c => {
        c.copyNumber == Number(this.selectedRow.copyNumber) &&
          c.flierNumber == this.notification;
      });
      if (idx > -1)
        this.deletedCopies.push({
          copyNumber: Number(this.selectedRow.copyNumber),
          flierNumber: this.notification,
        });
    } else {
      this.deletedCopies.push({
        copyNumber: Number(this.selectedRow.copyNumber),
        flierNumber: this.notification,
      });
    }
    this.columns.remove(event.data);
    this.columns.refresh();
    this.hasDataChanged();
  }

  handleUserCopy(user: IUserAccessAreaRelational) {
    let copyNumber;
    if (this.selectedRow != null) {
      copyNumber = this.selectedRow.copyNumber;
    } else {
      copyNumber = this.copyCounter;
      this.copyCounter += 1;
    }
    const copy: ICopiesxFlier = {
      copyNumber: copyNumber,
      copyuser: user.user,
      persontype: FlyerPersontype.C,
      flierNumber: this.notification,
    };
    const row: userCopy = {
      ...user,
      ...copy,
      type: 'C.P.P.',
    };
    if (this.selectedRow != null) {
      if (this.editedCopies.length > 0) {
        const idx = this.editedCopies.findIndex(c => {
          c.copyNumber == Number(this.selectedRow.copyNumber) &&
            c.flierNumber == this.notification;
        });
        if (idx > -1) this.editedCopies.push(copy);
      } else {
        this.editedCopies.push(copy);
      }
      this.columns.update(this.selectedRow, row);
      this.columns.refresh();
      this.hasDataChanged();
    } else {
      this.addCopies.push(copy);
      this.columns.append(row);
      this.columns.refresh();
      this.hasDataChanged();
    }
  }

  openModal(context?: Partial<AddEditFlyerCopyComponent>) {
    const modalRef = this.modalService.show(AddEditFlyerCopyComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onChange.subscribe(data => {
      if (data) this.handleUserCopy(data);
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.loading = true;
    this.addCopies.forEach(c => {
      this.flyerCopiesService.create(c).subscribe({
        next: () => {},
        error: err => {
          console.log(err);
        },
      });
    });
    this.editedCopies.forEach(c => {
      this.flyerCopiesService.update(c).subscribe({
        next: () => {},
        error: err => {
          console.log(err);
        },
      });
    });
    this.deletedCopies.forEach(c => {
      this.flyerCopiesService.remove(c).subscribe({
        next: () => {},
        error: err => {
          console.log(err);
        },
      });
    });
    setTimeout(() => {
      this.loading = false;
      this.handleSuccess();
    }, 2000);
  }

  handleSuccess() {
    this.onSave.emit(true);
    this.modalRef.hide();
  }
}
