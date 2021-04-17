/**
 *
 * TrackDetailsContainer
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Card, Typography, Space, Avatar } from 'antd';
import { musicContainerCreators } from '../MusicContainer/reducer';

const { Title, Text, Paragraph } = Typography;

const Container = styled.div`
  && {
    display: flex;
    flex-direction: column;
    max-width: ${props => props.maxwidth}px;
    width: 100%;
    margin: 0 auto;
    padding: ${props => props.padding}px;
  }
`;

export function TrackDetailsContainer(props) {
  const { track, dispatchGetTrack } = props;
  const { trackId } = props.match.params;

  useEffect(() => {
    dispatchGetTrack(trackId * 1);
  }, []);

  return (
    <Container>
      <Card>
        <Space direction="vertical">
          <Title id={'TrackDetailsContainer'} />
          <Title> {track.trackName} </Title>
          <Avatar src={track.artworkUrl100} shape="square" size={100} />
          <audio src={track.previewUrl} controls />
          <Text>Artist: {track.artistName}</Text>
          <Text>
            Price: {track.collectionPrice} {track.currency}
          </Text>
          <Text>
            Rental Price: {track.trackRentalPrice} {track.currency}
          </Text>
          <Text>Collection Name: {track.collectionName} </Text>
          <Paragraph>Description: {track.longDescription}</Paragraph>
        </Space>
      </Card>
    </Container>
  );
}

TrackDetailsContainer.propTypes = {
  dispatchGetTrack: PropTypes.func,
  track: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = state => {
  return { track: state.musicContainer.track };
};

function mapDispatchToProps(dispatch) {
  const { getTrack } = musicContainerCreators;

  return {
    dispatchGetTrack: trackId => dispatch(getTrack(trackId))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(TrackDetailsContainer);

export const TrackDetailsContainerTest = compose()(TrackDetailsContainer);
