import _ from 'lodash';
import React from 'react';
import ImageDiff from 'react-image-diff';
import classNames from 'classnames';
import {Clearfix, ButtonGroup, Button,
  Jumbotron, Grid, Row, Col, Panel}
  from 'react-bootstrap';

function _renderDefaultView(paths) {
  return <div className="simple">
    <img className="diff"
         src={paths.diff}
         key={paths.diff} />
  </div>;
}

function _render2UpView(paths) {
  return <div className="simple">
    <Grid>
      <Row className="show-grid">
        <Col xs={12} md={6}>
          <img className="baseline"
               src={paths.baseline}
               key={paths.baseline} />
        </Col>
        <Col xs={12} md={6}>
          <img className="screenshot"
               src={paths.screenshot}
               key={paths.screenshot} />
        </Col>
      </Row>
    </Grid>
  </div>;
}

function _renderSwipeView(paths, value, onSwipeOrFadeValueChange) {
  return <div className="special">
    <ImageDiff before={paths.screenshot}
               after={paths.baseline}
               type="swipe"
               value={value} />
    <Clearfix />
    <input type="range"
           min={0}
           max={1}
           step={.01}
           defaultValue={value}
           onChange={onSwipeOrFadeValueChange} />
  </div>;
}

function _renderFadeView(paths, value, onSwipeOrFadeValueChange) {
  return <div className="special">
    <ImageDiff before={paths.screenshot}
               after={paths.baseline}
               type="fade"
               value={value} />
    <Clearfix />
    <input type="range"
           min={0}
           max={1}
           step={.01}
           defaultValue={value}
           onChange={onSwipeOrFadeValueChange} />
  </div>;
}

class FailedTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'default',
      value: 0.5,
      openError: false
    };

    this.onSwipeOrFadeValueChange = this.onSwipeOrFadeValueChange.bind(this);
    this.onViewChange = this.onViewChange.bind(this);
    this.onErrorMessageOpen = this.onErrorMessageOpen.bind(this);
  }

  render() {
    const {paths, error} = this.props;

    return <div className="diffs">
      <Button bsStyle="danger"
              bsSize="xsmall"
              onClick={this.onErrorMessageOpen}>
        Show Error
      </Button>

      <Panel collapsible expanded={this.state.openError} bsStyle="danger">
        {_.isUndefined(paths)
          ? <p> This test did not fail because Mugshot found differences :( </p>
          : <p> {error.name} : {error.message} </p> }
      </Panel>

      {!_.isUndefined(paths) ? this._renderSelectedView(paths) : null }
    </div>;
  }

  onSwipeOrFadeValueChange(element) {
    this.setState({
      value: parseFloat(element.target.value)
    });
  }

  onViewChange(element) {
    var selectedView = element.target.name;

    this.setState({
      view: selectedView
    });
  }

  onErrorMessageOpen() {
    this.setState({
      openError: !this.state.openError
    });
  }

  _renderSelectedView(paths) {
    const currentView = this.state.view;

    const buttons = this._getSelectViewButtons(currentView,
      FailedTest.VIEW_OPTIONS, this.onViewChange);

    const report = FailedTest.VIEW_HANDLERS[currentView](paths,
      this.state.value, this.onSwipeOrFadeValueChange);

    return <div>
      <Jumbotron> {report} </Jumbotron>
      <ButtonGroup className="view-selector">
        {buttons}
      </ButtonGroup>
    </div>;
  }

  _getSelectViewButtons(currentView, viewOptions, onViewChange) {
    let buttons = [];

    viewOptions.forEach(function(item) {
      buttons.push(
        <Button name={item}
                key={item}
                onClick={onViewChange}
                className={classNames({active: item === currentView})}>
          {item}
        </Button>
      );
    });

    return buttons;
  }
}

FailedTest.displayName = 'FailedTest';
FailedTest.VIEW_OPTIONS = ['default', '2-up', 'swipe', 'fade'];
FailedTest.VIEW_HANDLERS = {
  'default': _renderDefaultView,
  '2-up': _render2UpView,
  'swipe': _renderSwipeView,
  'fade': _renderFadeView
};

export default FailedTest;
