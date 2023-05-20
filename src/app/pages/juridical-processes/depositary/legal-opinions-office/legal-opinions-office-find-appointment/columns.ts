//Components

import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_APPOINTMENT = {
  id: {
    title: 'No. Oficio Dic.',
    sort: false,
  },
  typeDict: {
    title: 'Tipo Dic.',
    sort: false,
  },
  passOfficeArmy: {
    title: 'Cve. Oficio Armada',
    sort: false,
  },
  expedientNumber: {
    title: 'No. Expediente',
    sort: false,
  },
  wheelNumber: {
    title: 'No. Volante',
    sort: false,
  },
  dictDate: {
    title: 'Fecha Dic.',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  registerNumber: {
    title: 'No. Registro',
    sort: false,
  },
};
// {
//     "id": 5787,
//     "passOfficeArmy": "DELEGACION VERACRUZ/DEL-VER/DEL-VER/00025/2004",
//     "expedientNumber": "203606",
//     "typeDict": "PROCEDENCIA",
//     "statusDict": "DICTAMINADO",
//     "dictDate": "2004-03-30",
//     "userDict": "JALVAREZ",
//     "observations": null,
//     "delegationDictNumber": "8",
//     "areaDict": "8",
//     "instructorDate": "2004-01-19",
//     "registerNumber": "2378557",
//     "esDelit": "N",
//     "wheelNumber": "419295",
//     "keyArmyNumber": "25",
//     "notifyAssuranceDate": null,
//     "resolutionDate": null,
//     "notifyResolutionDate": null,
//     "folioUniversal": null,
//     "entryDate": null,
//     "dictHcDAte": null,
//     "entryHcDate": null
// }
