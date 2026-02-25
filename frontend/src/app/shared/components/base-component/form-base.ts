import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../dialog/dialog';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-base',
  templateUrl: './form-base.html',
  imports: [FormsModule, ReactiveFormsModule, Dialog],
})
export class FormBaseComponent implements OnDestroy {
  protected fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  protected readonly toast = inject(ToastrService);
  protected destroy$ = new Subject<void>();
  private dialog_props: { title: string; content: string } | undefined;

  buildFormFromArray(fields: any[]): FormGroup {
    const group: Record<string, FormControl> = {};
    fields.forEach(f => {
      group[f.key] = new FormControl(f.defaultValue ?? '', f.validators ?? []);
    });

    return this.fb.group(group);
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  set _dialog_props(props: any) {
    console.log('porps:', props);
    this.dialog_props = props;
  }

  get _dialog_props() {
    return this.dialog_props;
  }


  openDialog() {
    const dialogRef = this.dialog.open(Dialog, { data: this._dialog_props });
    dialogRef.afterClosed().subscribe(result => {});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
