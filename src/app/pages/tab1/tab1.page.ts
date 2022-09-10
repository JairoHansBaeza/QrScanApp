/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AfterViewInit, Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { promise } from 'protractor';
import { resourceLimits } from 'worker_threads';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {

  camActive: boolean = false;

  constructor(private platform: Platform, private alertCtrl: AlertController) {}

  ngAfterViewInit(){
    if (this.platform.is('capacitor'))
    {
      BarcodeScanner.prepare();
    }
  }

  async scan(){
    if(this.platform.is('capacitor'))   //Validar la plataforma utilizada
    {
      if(this.checkPermission)          //Validar los permisos de la camara antes de scanear
      {
        this.camActive = true;
        const status = await BarcodeScanner.checkPermission({ force: true });
        console.log(status);
        const result = await BarcodeScanner.startScan();
        if(result.hasContent)
        {
          this.camActive = false;
          console.log(result);
        }
      }
    }
    else
    {
      console.log('Estamos en la web');
    }
  }

  async checkPermission()  {              //Validamos los permisos de la camara
    return new Promise(async (resolve,reject)=>{
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted)
      {
        resolve(true);
      }
      else if (status.denied)
      {
        //Le mostramos una notificacion al usuario (PopUp) preguntandole si desea activar los permisos
        const alert = this.alertCtrl.create({
          header:'Sin permisos',
          message:'Por favor permita el acceso a la camara en sus preferencias',
          buttons:[
            {
              text:'No',
              role:'Cancel'
            },
            {
              text:'Abrir preferencias',
              handler:()=>{
                BarcodeScanner.openAppSettings();
                resolve(false);
              }
            }
          ]
        });

        await (await alert).present();
      }else {
        resolve(reject);
      }
    });


  }
}
