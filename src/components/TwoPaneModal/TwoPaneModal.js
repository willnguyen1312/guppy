// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { hideModal } from '../../actions';

type Props = {
  leftPane: React$Node,
  rightPane: React$Node,
  backface: React$Node,
  isFolded: boolean,
  state: 'entering' | 'entered' | 'exiting' | 'exited',
  onDismiss: () => void,
};

type State = {
  isBeingDismissed: boolean,
};

const foldSpringSettings = {
  stiffness: 66,
  damping: 20,
};

const transitSpringSettings = {
  stiffness: 95,
  damping: 25,
};

class TwoPaneModal extends PureComponent<Props, State> {
  state = {
    isBeingDismissed: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.state === 'exiting' && this.props.state === 'exited') {
      this.setState({ isBeingDismissed: false });
    }
  }

  dismiss = () => {
    this.setState({ isBeingDismissed: true });

    this.props.onDismiss();
  };

  render() {
    const { isFolded, state, leftPane, rightPane, backface } = this.props;
    const { isBeingDismissed } = this.state;

    if (state === 'exited') {
      return null;
    }

    const inTransit = state === 'entering' || state === 'exiting';

    // prettier-ignore
    const modalVerticalTranslate = state === 'entering' || isBeingDismissed
        ? 50
        : state === 'exiting'
          ? -50
          : 0;

    return (
      <Wrapper
        style={{
          opacity: inTransit ? 0 : 1,
          transition: state === 'exiting' ? 'opacity 400ms' : 'opacity 400ms',
        }}
      >
        <Backdrop onClick={this.dismiss} />

        <Motion
          style={{
            foldDegrees: spring(isFolded ? 180 : 0, foldSpringSettings),
            translateX: spring(isFolded ? -25 : 0, foldSpringSettings),
            translateY: spring(modalVerticalTranslate, transitSpringSettings),
          }}
        >
          {({ foldDegrees, translateX, translateY }) => (
            <PaneWrapper translateX={translateX} translateY={translateY}>
              <LeftHalf foldDegrees={foldDegrees}>
                <LeftPaneWrapper>
                  <PaneChildren>{leftPane}</PaneChildren>
                </LeftPaneWrapper>

                <BackfaceWrapper>{backface}</BackfaceWrapper>
              </LeftHalf>

              <RightPaneWrapper>
                <PaneChildren>{rightPane}</PaneChildren>
              </RightPaneWrapper>
            </PaneWrapper>
          )}
        </Motion>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(230, 230, 230, 0.8);
`;

const PaneWrapper = styled.div.attrs({
  style: props => ({
    transform: `translate(
      ${props.translateX}%,
      ${props.translateY}%
    )`,
  }),
})`
  position: relative;
  z-index: 2;
  width: 80%;
  max-width: 850px;
  display: flex;
  will-change: transform;
`;

const LeftHalf = styled.div.attrs({
  style: props => ({
    transform: `perspective(2000px) rotateY(${props.foldDegrees}deg)`,
  }),
})`
  position: relative;
  z-index: 2;
  flex: 1;
  will-change: transform;
  transform-origin: center right;
  transform-style: preserve-3d;
`;

const LeftPaneWrapper = styled.div`
  height: 100%;
  color: ${COLORS.white};
  background-image: linear-gradient(
    70deg,
    ${COLORS.blue[700]},
    ${COLORS.teal[500]}
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border: 4px solid ${COLORS.white};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px 0 0 8px;
  backface-visibility: hidden;
`;

const RightPaneWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  background: ${COLORS.white};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0 8px 8px 0;
`;

const BackfaceWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: rotateY(180deg);
  transform-origin: center center;
  backface-visibility: hidden;
`;

const PaneChildren = styled.div`
  padding: 30px;
  height: 100%;
`;

export default connect(
  null,
  { onDismiss: hideModal }
)(TwoPaneModal);