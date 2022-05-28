import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'compvid-pdclosemodal',
  templateUrl: 'pdclosemodal.component.html',
})
export class PdclosemodalComponent extends BaseComponent implements OnInit  {
  modalTitle!: string;
  modelId!: number;

  constructor(private modalController: ModalController,
    private navParams: NavParams) {
    super();
  }

  ngOnInit() {
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }

  // keep editing, no changes
  closeModal() {

  }

  async confirmAbandon() {
    // could pass back structured data
    // const onClosedData = {should: 'continue', confirmed: true};
    // but simple string adequate here
    await this.modalController.dismiss('continue');
  }

  async discardChanges() {
    await this.modalController.dismiss('discard');
  }
}
