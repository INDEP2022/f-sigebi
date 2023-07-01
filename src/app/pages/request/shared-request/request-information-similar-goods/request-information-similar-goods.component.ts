import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-request-information-similar-goods',
  templateUrl: './request-information-similar-goods.component.html',
  styleUrls: ['./request-information-similar-goods.component.scss'],
})
export class RequestInformationSimilarGoodsComponent
  implements OnInit, OnChanges
{
  toggleInfo: boolean = true;
  requestInfo: any;
  @Input() request: number | any;

  regionalDelegation: string = '';
  state: string = '';
  transferent: string = '';
  station: string = '';
  authority: string = '';

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.getRequestInfo();
  }

  ngOnInit(): void {
    console.log(this.request);
  }

  getRequestInfo() {
    if (this.request) {
      setTimeout(() => {
        this.regionalDelegation = this.request.regionalDelegation.description;
        this.state = this.request.state.descCondition;
        this.transferent = this.request.transferent.name;
        this.station = this.request.emisora.stationName;
        this.authority = this.request.authority
          ? this.request.authority.authorityName
          : '';
        this.requestInfo = this.request;
      }, 300);
    }
  }
}
