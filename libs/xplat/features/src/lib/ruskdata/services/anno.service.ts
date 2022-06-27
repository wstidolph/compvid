import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// using dummy module decl in ./annotorious.d.ts
import { Annotorious } from '@recogito/annotorious';
import Toolbar from '@recogito/annotorious-toolbar'
import SelectorPack from '@recogito/annotorious-selector-pack'
import BetterPolygon from '@recogito/annotorious-better-polygon'

export enum DRAWTOOLS {
  FREEHAND='freehand', ELLIPSE='ellipse', CIRCLE='circle',
  POINT='point', RECT='rect', POLYGON='polygon'
}

// annotation entry body structure
export interface AEB {
  type: string;
  value: string;
  purpose: string
}

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

    // TODO fix PicturePage to pass in current server time
    if(config['serverTime']) {
      this._anno.setServerTime(config['serverTime'])
    }

    //connect events
    this._anno.on('selectAnnotation', (a:any, shape:any) => {

      const payload = {
        id: a.id,
        annotation: a,
        shape: shape}
      console.log('AS got selectAnnotation; a', a, ' shape', shape, ' payload:', payload);
      this._annoEvents$.next({type: 'selectAnnotation',
                              payload})
    });

    this._anno.on('cancelSelected', (a:any) => {

      const payload = {
        id: a.id,
        annotation: a
      }
      console.log('AS got cancelSelected', a, ' payload', payload);
      this._annoEvents$.next({
        type: 'cancelSelected',
        payload})
    });

    // essentially cancel prev selection, now select selected
    this._anno.on('changeSelected', (selected:any, previous:any) => {
      const payload = {
        id: selected.id,
        selected:selected, previous:previous
      }
      console.log('AS got changeSelected', payload);
      this._annoEvents$.next({type: 'changeSelected',
        payload})
    });

    this._anno.on('createAnnotation', (annotation:any) => {
      const payload = {
        id: annotation.id,
        annotation:annotation
      }
      console.log('AS got createAnnotation, payload:', payload);
        this._annoEvents$.next({type: 'createAnnotation', payload:{ annotation}})
    });

    this._anno.on('updateAnnotation', (annotation:any, previous:any) => {
      const payload = {
        id: annotation.id,
        annotation:annotation,
        previous:previous
      }
      console.log('AS got updateAnnotation', payload);
      this._annoEvents$.next({type: 'updateAnnotation',
        payload})
    });

    this._anno.on('clickAnnotation', (annotation:any, shape:any) => {
      const payload = {
        id: annotation.id,
        annotation:annotation, shape:shape
      }
      console.log('AS got clickAnnotation', payload);
      this._annoEvents$.next({type: 'clickAnnotation',
        payload})
    });

    this._anno.on('deleteAnnotation', (annotation:any) => {
      const payload = {
        id: annotation.id,
        annotation: annotation
      }
      console.log('AS got deleteAnnotation', payload);
      this._annoEvents$.next({type: 'deleteAnnotation',
        payload})
    });

    this._anno.on('mouseEnterAnnotation', (annotation:any) => {
      const payload = {
        id: annotation.id, // I hope
        annotation: annotation
      }
      console.log('AS got mouseEnterAnnotation', payload);
      this._annoEvents$.next({type: 'mouseEnterAnnotation',
        payload})
    });

    this._anno.on('mouseLeaveAnnotation', (annotation:any) => {
      const payload = {
        id: annotation.id,
        annotation: annotation
      }
      console.log('AS got mouseLeaveAnnotation', payload);
      this._annoEvents$.next({type: 'mouseLeaveAnnotation',
        payload})
    });

    this._isSetup = true;
  }
    setupToolbar(containerId: string, drawtoolsList: string[]=[]) {

      SelectorPack(this._anno, drawtoolsList.length >0? {tools: drawtoolsList}:  undefined); // add in tools
      BetterPolygon(this._anno);
      console.log('draw tools now', this._anno.listDrawingTools())
      Toolbar(this._anno, document.getElementById('AnnotoriousToolbarcontainer'));
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

    deleteAnnotation(annoId: string) {
      this._anno.removeAnnotation(annoId);
    }

    // highlight shape and open edit
    selectAnnotation(annoId: string) {
      this._anno.selectAnnotation(annoId);
    }

    setDrawingTool(toolname: string) {
      this._anno.setDrawingTool(toolname);
    }

    // utility data access functions
    extractCommentsAndTags(ae: any): {comments: string[], tags: string[]} {
      const anno = ae.payload.annotation
      // ae can have 1 or multiple body,
      // depends on what user fills out

      const theBody: AEB[] = anno.body;
      const commentArray = theBody.filter((bdyEl) => {return bdyEl.purpose === 'commenting' || bdyEl.purpose === 'replying'})
        .map(val => {return val.value} );
      const tagArray = theBody.filter((bdyEl) => {return bdyEl.purpose === 'tagging'})
        .map(val => {return val.value});

        return {comments: commentArray,
                tags: tagArray}
    }


}
