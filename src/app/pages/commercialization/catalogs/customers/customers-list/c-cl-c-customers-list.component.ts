import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CCrCCustomersRepresentativesComponent } from '../customers-representatives/c-cr-c-customers-representatives.component';
import { COLUMNS } from './columns';
import { data } from './data';

@Component({
  selector: 'app-c-cl-c-customers-list',
  templateUrl: './c-cl-c-customers-list.component.html',
  styles: [],
})
export class CClCCustomersListComponent extends BasePage implements OnInit {
  data: any[] = data;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        add: false,
        edit: false,
        delete: false,
        columnTitle: 'Representantes',
        custom: [
          {
            name: 'export',
            title: this.sanitizer.bypassSecurityTrustHtml(`
              <button type="button" class="btn btn-success btn-sm active">
               <i class='bx bx-export' ></i>
              </button>
            `),
          },
          {
            name: 'info',
            title: this.sanitizer.bypassSecurityTrustHtml(`
              <button type="button" class="btn btn-info btn-sm active">
              <i class='bx bx-info-circle'></i>
              </button>
            `),
          },
        ],
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
  }

  openModal(context?: Partial<CCrCCustomersRepresentativesComponent>): void {
    const modalRef = this.modalService.show(
      CCrCCustomersRepresentativesComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );

    /*modalRef.content.selected.subscribe((data: any) => {
      //console.log(data)
      //if (data)
    });*/
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onCustom(event: any) {
    if (event.action === 'info') {
      this.openModal();
      //alert('info')
    } else {
      //alert('export')
    }
    //alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
  }
}
