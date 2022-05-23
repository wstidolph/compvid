export class Place {
  namesInOrder; // names are unique within scope of upper name
                // e.g., "inside.kitchen.pantry" != "inside.pantry"
                // so this is used as the natural key for Places in the database

  constructor (name: string){
    this.namesInOrder = name;
  }
  // putting these utility functions directly in the model because they're tied to
  // model's semantics (the names form the key, so we can easily query for
  // all the Places 'in' another place, like all the places 'inside'
  get placeNames() : string[] {
    return this.namesInOrder.split('.');
  }

  get parentName() {
    const lastDot = this.namesInOrder.lastIndexOf('.');
    return this.namesInOrder.slice(0,lastDot)
  }

  // place's name is the last entry in the namesInOrder string/key
  get name() {
    const lastDot = this.namesInOrder.lastIndexOf('.');
    return this.placeNames.slice(lastDot+1)
  }

  makeChild(name:string): Place{
    if(!name) return this;
    const childName = this.namesInOrder + '.' + name;
    return new Place(childName.replace('..', '.'))
  }
}

