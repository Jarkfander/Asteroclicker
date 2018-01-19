import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OreViewComponent } from './ore-view/ore-view.component';
import { SortPipe, OreListComponent } from './ore-list/ore-list.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { OreService } from './ore.service';
import { SearchResultComponent } from '../search/search-result/search-result.component';
import { SearchModule } from '../search/search.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    SearchModule
  ],
  declarations: [ OreViewComponent, OreListComponent,SortPipe],
  exports:[
    OreViewComponent,OreListComponent, SortPipe
  ],
  providers:[OreService]

})
export class OreModule { }
