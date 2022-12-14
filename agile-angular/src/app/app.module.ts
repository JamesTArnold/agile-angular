import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ProjectsComponent } from './projects/projects.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { ProjectFormComponent } from './projects/project-form/project-form.component';
import { KanbanComponent } from './kanban/kanban.component';
import { IssueFormComponent } from './issue-form/issue-form.component';
import { TruncatePipe } from './truncate.pipe';
import { ScrumComponent } from './scrum/scrum.component';
import { SprintFormComponent } from './scrum/sprint-form/sprint-form.component';
import { ActiveSprintComponent } from './scrum/active-sprint/active-sprint.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LandingPageComponent,
    NavigationComponent,
    ProjectFormComponent,
    KanbanComponent,
    IssueFormComponent,
    TruncatePipe,
    ScrumComponent,
    SprintFormComponent,
    ActiveSprintComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    DragDropModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],

  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule {}
