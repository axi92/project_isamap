import { defineStore } from 'pinia';

export interface DebugState {
  enabled: boolean;
}

export const useDebugStore = defineStore('debug', {
  state: (): DebugState => ({
    enabled: localStorage.getItem('debug') === 'true',
  }),
  actions: {
    toggle(): boolean {
      this.enabled = !this.enabled;
      localStorage.setItem('debug', String(this.enabled));
      return this.enabled;
    },
    set(value: boolean): void {
      this.enabled = value;
      localStorage.setItem('debug', String(this.enabled));
    },
    get(): boolean {
      return this.enabled;
    },
    save(): void {
      localStorage.setItem('debug', String(this.enabled));
    },
  },
});
