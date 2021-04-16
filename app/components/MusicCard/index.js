/**
 *
 * Card
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Avatar } from 'antd';
// import { FormattedMessage } from 'react-intl';
import T from '@components/T';

const MusicContent = styled.div`
  display: flex;
  align-items: center;
  height: 120px;
  &:hover {
    cursor: pointer;
  }
`;

function MusicCard({ artworkUrl, title, artistName, collectionName, onClick }) {
  return (
    <Card data-testid="musicCard">
      <MusicContent onClick={onClick}>
        <Avatar src={artworkUrl} shape="square" size={100} />
        <div style={{ paddingLeft: '0.6em' }}>
          <T id="music_title" values={{ title }} />
          <T id="artist_name" values={{ artistName }} />
          <T id="music_collection_name" values={{ collectionName }} />
        </div>
      </MusicContent>
    </Card>
  );
}

MusicCard.propTypes = {
  artworkUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default MusicCard;
