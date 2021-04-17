import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { Card, Skeleton, Input, Row, Col } from 'antd';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import T from '@components/T';
import Clickable from '@components/Clickable';
import MusicCard from '@components/MusicCard';
import { useInjectSaga } from 'utils/injectSaga';
import { selectMusicContainer, selectTracksData, selectTracksError, selectMusicSearchTerm } from './selectors';
import { musicContainerCreators } from './reducer';
import saga from './saga';

const { Search } = Input;
const CustomCard = styled(Card)`
  && {
    margin: 20px 0;
    max-width: ${props => props.maxwidth};
    color: ${props => props.color};
    ${props => props.color && `color: ${props.color}`};
  }
`;

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

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
`;

export function MusicContainer({
  dispatchItunesTracks,
  dispatchClearItunesTracks,
  intl,
  musicData = {},
  musicError = null,
  searchTerm,
  maxwidth,
  padding
}) {
  // console.log("musicData", musicData);
  useInjectSaga({ key: 'musicContainer', saga });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loaded = get(musicData, 'results', null) || musicError;
    if (loading && loaded) {
      setLoading(false);
    }
  }, [musicData]);

  useEffect(() => {
    if (searchTerm && !musicData?.results?.length) {
      dispatchItunesTracks(searchTerm);
      setLoading(true);
    }
  }, []);

  const history = useHistory();

  const handleOnChange = searchTerm => {
    if (!isEmpty(searchTerm)) {
      dispatchItunesTracks(searchTerm);
      setLoading(true);
    } else {
      dispatchClearItunesTracks();
    }
  };

  const debouncedHandleOnChange = debounce(handleOnChange, 200);

  const renderMusicList = () => {
    const items = get(musicData, 'results', []);
    const totalCount = get(musicData, 'resultCount', 0);
    const onClick = (e, trackId) => {
      history.push(`/track-details/${trackId}`);
      // window.open(trackViewUrl, '_blank');
    };

    return (
      (items.length !== 0 || loading) && (
        <div>
          {searchTerm && (
            <div>
              <T id="search_query" values={{ query: searchTerm }} />
            </div>
          )}
          {totalCount !== 0 && (
            <div>
              <T id="matching_music" values={{ totalCount }} />
            </div>
          )}
          <Skeleton loading={loading} active>
            <Row justify="center">
              {items.map((item, index) => (
                <Col key={index} xs={24} md={16} lg={8}>
                  <MusicCard
                    artworkUrl={item.artworkUrl100}
                    title={item.trackName}
                    artistName={item.artistName}
                    collectionName={item.collectionName}
                    onClick={e => onClick(e, item.trackId)}
                  />
                </Col>
              ))}
            </Row>
          </Skeleton>
        </div>
      )
    );
  };

  const renderErrorState = () => {
    let error;
    if (error) {
      error = musicError;
    } else if (!get(musicData, 'resultCount', 0)) {
      error = 'music_search_default';
    }

    return (
      !loading &&
      error && (
        <CustomCard color={error ? 'red' : 'grey'} title={intl.formatMessage({ id: 'music_list' })}>
          <T id={error} />
        </CustomCard>
      )
    );
  };

  const gotToStoriesPage = () => {
    history.push('/stories');
    window.location.reload();
  };

  const gotToHomePage = () => {
    history.push('/');
  };

  return (
    <Container padding={padding}>
      <RightContent>
        <Clickable textId="stories" onClick={gotToStoriesPage} />
        <Clickable textId="home" onClick={gotToHomePage} />
      </RightContent>

      <CustomCard title={intl.formatMessage({ id: 'music_search' })} maxwidth={maxwidth}>
        <T marginBottom={10} id="get_music_details" />
        <Search
          data-testid="search-bar"
          defaultValue={searchTerm}
          type="text"
          onChange={evt => debouncedHandleOnChange(evt.target.value)}
          onSearch={searchText => debouncedHandleOnChange(searchText)}
          enterButton
        />
      </CustomCard>
      {renderMusicList()}
      {renderErrorState()}
    </Container>
  );
}

MusicContainer.propTypes = {
  dispatchItunesTracks: PropTypes.func,
  dispatchClearItunesTracks: PropTypes.func,
  intl: PropTypes.object,
  musicData: PropTypes.shape({
    resultCount: PropTypes.number,
    results: PropTypes.array
  }),
  musicError: PropTypes.string,
  searchTerm: PropTypes.string,
  history: PropTypes.object,
  maxwidth: PropTypes.number,
  padding: PropTypes.number
};

MusicContainer.defaultProps = {
  maxwidth: 500,
  padding: 20
};

const mapStateToProps = createStructuredSelector({
  musicContainer: selectMusicContainer(),
  musicData: selectTracksData(),
  musicError: selectTracksError(),
  searchTerm: selectMusicSearchTerm()
});

function mapDispatchToProps(dispatch) {
  const { requestGetItunesTracks, clearItunesTracks } = musicContainerCreators;

  return {
    dispatchItunesTracks: searchTerm => dispatch(requestGetItunesTracks(searchTerm)),
    dispatchClearItunesTracks: () => dispatch(clearItunesTracks())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  injectIntl,
  withConnect,
  memo
)(MusicContainer);

export const MusicContainerTest = compose(injectIntl)(MusicContainer);
