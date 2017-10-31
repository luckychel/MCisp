import { NgModule, ModuleWithProviders  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { IonPickerComponent } from './ion-picker/ion-picker';
import { IonPickerService } from './ion-picker/ion-picker-service';
import { BoldPrefix } from './boldprefix.pipe';
import { IonicModule} from 'ionic-angular';

export * from './ion-picker/ion-picker';
export * from './boldprefix.pipe';
export * from './ion-picker/ion-picker-service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    IonPickerComponent,
    BoldPrefix
  ],
  exports: [
    IonPickerComponent,
    BoldPrefix
  ]
})
@NgModule({
	declarations: [IonPickerComponent],
	imports: [],
	exports: [IonPickerComponent]
})

export class MCispComponentModule {}
