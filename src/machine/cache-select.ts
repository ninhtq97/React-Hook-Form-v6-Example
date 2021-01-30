import { GlobalState } from 'little-state-machine';

export const cacheSelect = (
  state: GlobalState,
  payload: { page: number; size: number; rowId: string }
) => {
  console.log('Payload:', payload);

  let existsPage = state.selected.find((x) => x.page === payload.page);

  console.log('Exists Page:', existsPage);

  let selected = [
    ...state.selected,
    ...[{ page: payload.page, selectAll: false, rowIds: [payload.rowId] }],
  ];

  if (existsPage) {
    const unSelect = existsPage.rowIds.indexOf(payload.rowId);
    const pageIndex = state.selected.findIndex(
      (x) => x.page === existsPage.page
    );
    // console.log('Page Index:', pageIndex);

    if (unSelect >= 0) {
      existsPage.rowIds.splice(unSelect, 1);
    } else {
      existsPage.rowIds.push(payload.rowId);
    }

    existsPage.selectAll = existsPage.rowIds.length === payload.size;

    selected = [
      ...state.selected.slice(0, pageIndex),
      existsPage,
      ...state.selected.slice(pageIndex + 1),
    ];
  }

  // console.log('selected:', selected);

  return {
    ...state,
    selected: selected,
  };
};

export const cacheAllPage = (
  state: GlobalState,
  payload: { page: number; rowIds: string[] }
) => {
  let existsPage = state.selected.find((x) => x.page === payload.page);

  let selected = [
    ...state.selected,
    ...[{ page: payload.page, selectAll: true, rowIds: payload.rowIds }],
  ];

  if (existsPage) {
    const pageIndex = state.selected.findIndex(
      (x) => x.page === existsPage.page
    );

    if (!existsPage.selectAll) {
      existsPage.selectAll = true;
      existsPage.rowIds = payload.rowIds;
    } else {
      existsPage.selectAll = false;
      existsPage.rowIds = [];
    }

    selected = [
      ...state.selected.slice(0, pageIndex),
      existsPage,
      ...state.selected.slice(pageIndex + 1),
    ];
  }

  return {
    ...state,
    selected: selected,
  };
};

export const clearCache = (state: GlobalState, payload: any) => {
  return { selected: [] };
};
