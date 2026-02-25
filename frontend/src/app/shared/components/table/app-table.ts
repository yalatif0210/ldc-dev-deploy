import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { Dispatcher } from '@shared/services/dispatcher';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; // Column Definition Type Interface
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBaseComponent } from '../base-component/form-base';
import { ro } from 'date-fns/locale';
import { Router } from '@angular/router';

// Register required modules globally, before any grids are instantiated
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './app-table.html',
  styleUrl: '../../../routes/public/report/lab-report/lab.scss',
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MtxGridModule],
})
export class AppTable implements OnInit, OnDestroy {
  dispatcherSubscription = Subscription.EMPTY;
  private destroy$ = new Subject<void>();
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);

  isLoading = true;
  datas: { datas: any[]; columns: any[] } = { datas: [], columns: [] };
  specific_columns = 'action';
  init_report_action = 'actions';
  consulter_report_action = 'consulter';

  defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    flex: 1,
    cellStyle: {
      borderRight: '1px solid #dee2e6',
      borderBottom: '1px solid #dee2e6',
      padding: '0 8px',
    },
  };

  itemsPerPage = 10;

  ngOnInit() {
    this.dispatcherSubscription = this.dispatcher.dispatch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('notify data: - app-table.ts:71', data);
        if (data) {
          this.datas = data;
          this.isLoading = false;
        }
      });
  }

  onCellClicked(row: any) {
    console.log('Cell clicked: - app-table.ts:80', row);
    this.openManageUsersDialog(row);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  page = 1;
  pageSize = 5;
  totalPages = 1;

  changePage(direction: number) {
    this.page += direction;
    if (this.page < 1) this.page = 1;
    if (this.page > this.totalPages) this.page = this.totalPages;
  }

  paginate<T>(pageNumber: number) {
    const array = this.datas.datas.slice();
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    return array.slice(start, end);
  }

  setCurrentPage(page: number) {
    this.page = page;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.datas.datas.length / this.pageSize);
  }

  get arrayFromTotalPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  manageUsersDialog = inject(MatDialog);

  openManageUsersDialog(data: any) {
    const dialogRef = this.manageUsersDialog.open(ManageUsersDialog, {
      height: '400px',
      width: '600px',
      data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Retour du dialog :  labreport.ts:562  manageusers.ts:130 - app-table.ts:127', result);
    });
  }

  onAction(params: any) {
    const navigateTo = '/zver/public/report/fill/laboratory';
    this.router.navigate([navigateTo], {
      queryParams: {
        data: JSON.stringify({
          equipment: params.equipment.name,
          period: params.period.periodName,
        }),
      },
    });
    //
  }

  onConsulter(params: any) {
    const navigateTo = '/zver/public/report/history';
    this.router.navigate([navigateTo], {
      queryParams: {
        data: JSON.stringify({
          id: params.id,
          equipment: params.equipment,
          period: params.period,
        }),
      },
    });
    //
  }
}

@Component({
  selector: 'manage-users-dialog',
  templateUrl: 'manage-users-dialog.html',
  styleUrls: ['../../../routes/public/report/lab-report/lab.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCard,
    MatCardContent,
  ],
})
export class ManageUsersDialog implements OnInit {
  public data: any = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ManageUsersDialog>);
  //public formBaseComponent = inject(FormBaseComponent);
  form: FormGroup | undefined;
  enabledSubmit = false;
  constructor() {
    this.form = new FormGroup({
      name: new FormControl({ value: this.data?.user?.name, disabled: false }),
      username: new FormControl({ value: this.data?.user?.username, disabled: false }),
      phone: new FormControl({ value: this.data?.user?.phone, disabled: false }),
      password: new FormControl({ value: '', disabled: false }),
      role: new FormControl({ value: this.data?.role?.role, disabled: true }),
    });
  }
  ngOnInit(): void {}

  onConfirm() {
    this.dialogRef.close('');
  }
}
