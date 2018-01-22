import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { SearchService } from './search.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [SearchResultComponent,SearchViewComponent],
  exports:[SearchResultComponent,SearchViewComponent],
  providers:[SearchService]
})
export class SearchModule { }
