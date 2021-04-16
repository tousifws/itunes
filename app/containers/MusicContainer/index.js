import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { Card, Skeleton, Input, Avatar } from 'antd';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import T from '@components/T';
import Clickable from '@components/Clickable';
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

const MusicContent = styled.div`
  display: flex;
  align-items: center;
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

    return (
      (items.length !== 0 || loading) && (
        <CustomCard>
          <Skeleton loading={loading} active>
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
            {items.map((item, index) => (
              <CustomCard key={index}>
                <MusicContent>
                  <Avatar src={item.artworkUrl100} shape="square" size={100} />
                  <div style={{ paddingLeft: '0.6em' }}>
                    <T id="music_title" values={{ title: item.trackName }} />
                    <T id="artist_name" values={{ artistName: item.artistName }} />
                    <T id="music_collection_name" values={{ collectionName: item.collectionName }} />
                  </div>
                </MusicContent>
              </CustomCard>
            ))}
          </Skeleton>
        </CustomCard>
      )
    );
  };

  const renderErrorState = () => {
    let error;
    if (error) {
      error = musicError;
    } else if (!get(musicData, 'totalCount', 0)) {
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
    <Container maxwidth={maxwidth} padding={padding}>
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
    totalCount: PropTypes.number,
    incompleteResults: PropTypes.bool,
    items: PropTypes.array
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
