import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppOfflinePage } from './app-offline.page';

describe('AppOfflinePage', () => {
  let component: AppOfflinePage;
  let fixture: ComponentFixture<AppOfflinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOfflinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppOfflinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
