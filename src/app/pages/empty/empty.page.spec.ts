import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmptyPage } from './empty.page';

describe('EmptyPage', () => {
  let component: EmptyPage;
  let fixture: ComponentFixture<EmptyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
