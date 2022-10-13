import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef} from 'ngx-bootstrap/modal';

import { DELEGATIONS_COLUMNS } from '../delegations-columns';

@Component({
  selector: 'app-fdp-adpdt-detail-delegations',
  templateUrl: './fdp-adpdt-detail-delegations.component.html',
  styles: [
  ]
})
export class FdpAdpdtDetailDelegationsComponent implements OnInit {
  
  title?: string = '';
  columns?: typeof DELEGATIONS_COLUMNS;
  data = EXAMPLE_DATA;
  
  constructor(
    public bsModalRef: BsModalRef
  ) {
    Object.assign( this.settings, {actions: false} );
  }

  ngOnInit(): void {
    this.settings.columns = this.columns;
  }
  
  selected( e:any ){
    console.log( e )
  }

}

const EXAMPLE_DATA = [
  {
    id: '5',
    description: "RPA",
  },
  {
    id: '5',
    description: "RPA",
  },
  {
    id: '5',
    description: "RPA",
  },
  {
    id: '5',
    description: "RPA",
  },
];
