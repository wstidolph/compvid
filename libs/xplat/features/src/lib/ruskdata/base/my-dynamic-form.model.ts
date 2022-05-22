import { PROVIDED_STORAGE_INSTANCES } from "@angular/fire/storage/storage.module";
import {
  DynamicFormModel,
  DynamicFormOptionConfig,
  DynamicFormArrayModel,
  DynamicInputModel,
  DynamicFormGroupModel,
  DynamicSelectModel,
  DynamicTextAreaModel,
} from "@ng-dynamic-forms/core";
import {BehaviorSubject} from 'rxjs'

export const LOCATIONS_LIST: DynamicFormOptionConfig<string>[] = [
  {value: '1', label: "NO PLACE OPTIONS DEFINED"}
];
  /*
  export interface DynamicFormOptionConfig<T> {
    disabled?: boolean;
    label?: string;
    value: T;
}
*/
export const MY_FORM_MODEL: DynamicFormModel   = [

  new DynamicFormGroupModel({
    id: "pdCore",
    group: [
      new DynamicInputModel({
            id: "pdName",
            label: "Sample Input",
            maxLength: 24,
            placeholder: "name this picture"
        }),

        new DynamicTextAreaModel({
          id: "pdDesc",
          label: "Description",
          maxLength: 80,
          placeholder: "general description of pic/contents",
        }),

        new DynamicSelectModel({
          id: "pdLoc",
          label: "Location",
          options: new BehaviorSubject(LOCATIONS_LIST) // replace with observable i the using component
        }),
  ]}),

  new DynamicFormGroupModel({
    id: "pditemseen",
    group: [
      new DynamicFormArrayModel({
        id: "itemseenFormArray",
        initialCount: 0,
        groupFactory: () => {
          return [
              new DynamicInputModel({
                  id: "itemseen",
                  label: "Desc"
              })
          ];
        }
      })
    ]
  })

];
