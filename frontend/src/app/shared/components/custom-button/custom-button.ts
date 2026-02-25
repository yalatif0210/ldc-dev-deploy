import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

interface CustomButtonParams extends ICellRendererParams {
  onClick: () => void;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <button
      [disabled]="disabled()"
      [style]="{
        width: '90%',
        height: '80%',
        backgroundColor: '#356b6f',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '2px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
        backgroundImage: 'linear-gradient(to bottom, #42a7ad, #356b6f)',
        backgroundRepeat: 'repeat-x',
        borderColor: 'rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)',
        margin: '2px 10px',
        padding: '3px 9px',
        fontSize: '12px',
        lineHeight: '18px',
        border: '1px solid #bbb',
        fontWeight: 'normal',
        cursor: disabled() ? 'not-allowed' : 'pointer'
      }"
      (click)="onClick()"
    >
      {{ btnText() }}
    </button>
  `,
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  onClick!: () => void;
  btnText = signal('');
  disabled = signal(false);

  agInit(params: CustomButtonParams): void {
    this.onClick = params.onClick;
    this.refresh(params);
  }
  refresh(params: CustomButtonParams) {
    this.btnText.set(params.data?.action ? 'Exécuter' : 'Non disponible');
    this.disabled.set(params.data?.action ? false : true);
    return true;
  }
}
