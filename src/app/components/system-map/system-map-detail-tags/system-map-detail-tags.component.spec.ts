import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SystemMapDetailTagsComponent } from './system-map-detail-tags.component';

describe('SystemMapDetailTagsComponent', () => {
  let component: SystemMapDetailTagsComponent;
  let fixture: ComponentFixture<SystemMapDetailTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMapDetailTagsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemMapDetailTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
