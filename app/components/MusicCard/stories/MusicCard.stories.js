/**
 *
 * Stories for MusicCard
 *
 * @see https://github.com/storybookjs/storybook
 *
 */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import MusicCard from '../index';

storiesOf('MusicCard').add('simple', () => <MusicCard id={text('id', 'MusicCard')} />);
