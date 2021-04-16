import { createSelector } from 'reselect';
import get from 'lodash/get';
import { initialState } from './reducer';

/**
 * Direct selector to the homeContainer state domain
 */

const selectMusicContainerDomain = state => state.musicContainer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HomeContainer
 */

export const selectMusicContainer = () =>
  createSelector(
    selectMusicContainerDomain,
    substate => substate
  );

export const selectTracksData = () =>
  createSelector(
    selectMusicContainerDomain,
    substate => get(substate, 'musicData', null)
  );

export const selectTracksError = () =>
  createSelector(
    selectMusicContainerDomain,
    substate => get(substate, 'musicError', null)
  );

export const selectMusicSearchTerm = () =>
  createSelector(
    selectMusicContainerDomain,
    substate => get(substate, 'searchTerm', null)
  );

export default selectMusicContainer;
