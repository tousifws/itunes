/**
 *
 * Tests for MusicCard
 *
 */

import React from 'react';
// import { fireEvent } from '@testing-library/dom'
import { renderWithIntl } from '@utils/testUtils';
import MusicCard from '../index';

describe('<MusicCard />', () => {
  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(<MusicCard />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 MusicCard component', () => {
    const { getAllByTestId } = renderWithIntl(<MusicCard />);
    expect(getAllByTestId('musicCard').length).toBe(1);
  });
});
