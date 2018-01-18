import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OreViewComponent } from './ore-view/ore-view.component';
import { SortPipe, OreListComponent } from './ore-list/ore-list.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { OreService } from './ore.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ OreViewComponent, SearchResultComponent, OreListComponent,SortPipe],
  exports:[
    OreViewComponent,OreListComponent, SortPipe
  ],
  providers:[OreService]

})
export class OreModule { }
