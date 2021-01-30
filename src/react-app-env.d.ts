/// <reference types="react-scripts" />

import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    selected: any[];
  }
}
