import { Injectable } from '@angular/core';
import { Annotorious } from '@recogito/annotorious';
import { BehaviorSubject } from 'rxjs';

/* provides and supports use of the Annotorius image annotator library
* @see https://github.com/recogito/annotorious
*/
@Injectable({
  providedIn: 'root',
})
export class AnnoService {

  private defaultConfig = {
      image: 'picimg', // image element or ID
      disableEditor: false,
      drawOnSingleClick: true,
      widgets: [
        { widget: 'COMMENT' },
        { widget: 'TAG', vocabulary: [
          'Art', 'Clothing','Cookware', 'Electronics','Furniture',
          'Jewelry', 'Houseware', 'Tool','Trinket'] }
      ]
  }

  private _anno!: any;

  _annoEvents$ = new BehaviorSubject<any>({});
  anno$ = this._annoEvents$.asObservable();

  private _isSetup = false;

  constructor() {

       // this.annoSetup();
  }

  get annoEvents$() {
    return this.anno$;
  }


  // TODO set up an interface type for Annotorious config
  annoSetup(config: Record<string, unknown> = this.defaultConfig) {

    // configure and instantiate
    console.log('AnnoSvc inits with ', config);

    this._anno = new Annotorious(config);

    //connect events
    this._anno.on('selectAnnotation', (a:any, shape:any) => {
      console.log('selected');
      this._annoEvents$.next({type: 'selectAnnotation',
                              payload:{ a: a,
                              shape: shape}})
    });

    this._anno.on('cancelSelected', (a:any) => {
      console.log('cancel');
      this._annoEvents$.next({type: 'cancelSelected', payload:{ a:a}})
    });

    this._anno.on('changeSelected', (selected:any, previous:any) => {
      console.log('changed from', previous, 'to', selected);
      this._annoEvents$.next({type: 'changeSelected',
        payload:{ selected, previous}})
    });

    this._anno.on('createAnnotation', (annotation:any) => {
      console.log('created', annotation);
        this._annoEvents$.next({type: 'createAnnotation', payload:{ annotation}})
    });

    this._anno.on('updateAnnotation', (annotation:any, previous:any) => {
      console.log('updated', previous, 'with', annotation);
      this._annoEvents$.next({type: 'updateAnnotation',
        payload:{ annotation, previous}})
    });

    this._anno.on('clickAnnotation', (annotation:any, shape:any) => {
      console.log('clicked', annotation);
      this._annoEvents$.next({type: 'clickAnnotation',
        payload:{ annotation, shape}})
    });

    this._anno.on('deleteAnnotation', (annotation:any) => {
      console.log('deleted', annotation);
      this._annoEvents$.next({type: 'deleteAnnotation',
        payload:{ annotation}})
    });

    this._anno.on('mouseEnterAnnotation', (annotation:any) => {
      console.log('enter', annotation);
      this._annoEvents$.next({type: 'mouseEnterAnnotation',
        payload:{ annotation}})
    });

    this._anno.on('mouseLeaveAnnotation', (annotation:any) => {
      console.log('leave', annotation);
      this._annoEvents$.next({type: 'mouseLeaveAnnotation',
        payload:{ annotation}})
    });

    this._isSetup = true;
  }

    setAuthorInfo({id, displayName}
      = {id: 'http://www.example.com/auser', displayName: 'AUser'})
    {
    this._anno.setAuthInfo({
      id: id,
      displayName: displayName});
      this._annoEvents$.next({
        type: 'userAuthSet',
        payload:{ id, displayName}
      })
    }

    loadAnnotations(src = 'assets/annotations.w3c.json') {
      if(this._isSetup){
        this._anno.loadAnnotations(src);
      }
      this._annoEvents$.next({
        type: 'annotationsLoaded',
        payload:{ src }
      })
    }

    setDrawingTool(toolname: string) {
      this._anno.setDrawingTool(toolname);
    }
}
