import { FormControl, Validators } from '@angular/forms';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';

export const JURIDICAL_FILE_DATA_UPDATE_FORM = {
  expedientNumber: new FormControl<number>(null),
  preliminaryInquiry: new FormControl<string>(null),
  criminalCase: new FormControl<string>(null),
  sender: new FormControl<IUserAccessAreaRelational>(null),
  recipient: new FormControl<IUserAccessAreaRelational>(null),
  passOfficeArmy: new FormControl<string>(null),
  city: new FormControl<ICity>(null),
  text1: new FormControl<string>(null, [Validators.maxLength(2000)]),
  textp: new FormControl<string>(null, Validators.maxLength(12000)),
  text2: new FormControl<string>(null, Validators.maxLength(4000)),
  text2To: new FormControl<string>(null, Validators.maxLength(4000)),
  text3: new FormControl<string>(null, Validators.maxLength(4000)),
  dictDate: new FormControl<string>(null),
  officeType: new FormControl<string>(null),
};
