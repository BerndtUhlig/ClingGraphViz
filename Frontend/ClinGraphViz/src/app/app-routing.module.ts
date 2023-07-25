import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AstPageComponent } from './ast-page/ast-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/ast_page', pathMatch: 'full' },
  { path: 'ast_page', component: AstPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
