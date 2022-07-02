export function convertSnaps<T>(results: { docs: any[]; }) {
  return <T[]>results.docs.map((snap:any) => {
    return {
      id: snap.id,
      ...<any>snap.data()
    }
  })
}

export function ensureStrInOnce(orig: string[] | undefined, strToAdd: string): [boolean, string[]] {
  if (!orig) {
    return [true, [strToAdd]];
  }

  const isAlreadyIn = orig.indexOf(strToAdd) > -1;
  if(isAlreadyIn) {
    return [false, orig]
  }

  orig.push(strToAdd); // then add once
  // return a copy
  return [true, orig.slice()]
}

export function ensureStrInNone(orig: string[] | undefined, strToRem: string): [boolean, string[] | undefined] {
  if(!orig) {
    return [false, orig]
  }
  if(orig.indexOf(strToRem) <0){
    return [false, orig]
  }

  return [true, orig.filter(str => str != strToRem)];
}

/**
 * ConstrolsOf makes Reactive Form controls
 * @see https://betterprogramming.pub/how-to-build-a-strongly-typed-angular-14-super-form-86837965a0e5
 */
 import { FormControl, FormGroup } from "@angular/forms";

 export type ControlsOf<T extends Record<string, any>> = {
   [K in keyof T]: T[K] extends Record<any, any>
   ? FormGroup<ControlsOf<T[K]>>
   : FormControl<T[K]>;
 };
