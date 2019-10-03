import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListingComponent } from './user-listing/user-listing.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserCreateComponent } from './user-create/user-create.component';


const routes: Routes = [
  {
    path: '',
    component: UserListingComponent
  },
  {
    path: 'create',
    component: UserCreateComponent
  },
  {
    path: 'update/:id',
    component: UserUpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
