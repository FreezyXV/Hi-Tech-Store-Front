import { createSelector } from "reselect";

const selectSearchState = (state) => state.search || {};

export const selectSearchData = createSelector(
  [selectSearchState],
  (searchState) => searchState.data || []
);

export const selectSearchStatus = createSelector(
  [selectSearchState],
  (searchState) => searchState.status || "idle"
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (searchState) => searchState.error || null
);
