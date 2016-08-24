import '../styles/components/failed.less';
import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import {ButtonGroup, Button, Jumbotron, Panel} from 'react-bootstrap';
import {Component} from 'react-component-tree';

import DefaultView from './views/defaultView.jsx';
import TwoUpView from './views/twoUpView.jsx';
import SwipeView from './views/swipeView.jsx';
import FadeView from './views/fadeView.jsx';

class FailedTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'default',
      openError: false
    };

    this.onViewChange = this.onViewChange.bind(this);
    this.onErrorMessageOpen = this.onErrorMessageOpen.bind(this);
  }

  get children() {
    return {
      view: (component, paths) => {
        return {
          component: component,
          paths: paths
        };
      },
      selectViewButton: (view) => {
        return {
          component: Button,
          name: view,
          key: view,
          onClick: this.onViewChange,
          className: classNames({active: view === this.state.view}),
          children: view
        };
      }
    };
  }

  render() {
    const {paths, error} = this.props;

    return <div className="diffs">

      {!_.isUndefined(error)
      ? <div>
        <Button bsStyle="danger"
                bsSize="xsmall"
                ref="errorButton"
                onClick={this.onErrorMessageOpen}>
          Show Error
        </Button>

        <Panel collapsible expanded={this.state.openError} bsStyle="danger">
          {error.name} : {error.message}
        </Panel>
      </div>
      : null}

      {!_.isUndefined(paths) ? this._renderSelectedView(paths) : null }
    </div>;
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
    const component =
      _.find(FailedTest.VIEWS, {name: this.state.view}).component;

    return <div>
      <Jumbotron> {this.loadChild('view', component, paths)} </Jumbotron>
      <ButtonGroup className="view-selector">
        {this._getSelectViewButtons()}
      </ButtonGroup>
    </div>;
  }

  _getSelectViewButtons() {
    let buttons = [];

    FailedTest.VIEWS.forEach(item => {
      buttons.push(this.loadChild('selectViewButton', item.name));
    });

    return buttons;
  }
}

FailedTest.displayName = 'FailedTest';

FailedTest.VIEWS = [
  {name: 'default', component: DefaultView},
  {name: '2-up', component: TwoUpView},
  {name: 'swipe', component: SwipeView},
  {name: 'fade', component: FadeView}
];

export default FailedTest;
