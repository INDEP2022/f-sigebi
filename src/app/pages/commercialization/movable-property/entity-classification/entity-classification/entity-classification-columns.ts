import { SelectDescriptionComponent } from 'src/app/shared/render-components/entity-classification/select-description/select-description.component';
import { SelectIdComponent } from 'src/app/shared/render-components/entity-classification/select-id/select-id.component';

export const ENTITY_CLASS_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
    editor: {
      type: 'custom',
      component: SelectIdComponent,
    },
  },
  description: {
    title: 'Descripción',
    sort: false,
    editor: {
      type: 'custom',
      component: SelectDescriptionComponent,
    },
  },
};
