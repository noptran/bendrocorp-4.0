import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertDetailPage } from './alert-detail.page';

describe('AlertDetailPage', () => {
  let component: AlertDetailPage;
  let fixture: ComponentFixture<AlertDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
