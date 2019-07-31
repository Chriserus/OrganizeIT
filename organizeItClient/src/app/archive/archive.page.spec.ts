import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivePage } from './archive.page';

describe('ArchivePage', () => {
  let component: ArchivePage;
  let fixture: ComponentFixture<ArchivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
