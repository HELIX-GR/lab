import _ from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import {
  Modal,
} from 'reactstrap';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Checkbox
} from './checkbox';

class CollectionSelectModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  static propTypes = {
    addFavoriteToCollection: PropTypes.func.isRequired,
    collections: PropTypes.arrayOf(PropTypes.object),
    favorite: PropTypes.object,
    removeFavoriteFromCollection: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  onCollectionToggle(collection, favorite, checked) {
    if (checked) {
      this.props.addFavoriteToCollection(collection, favorite);
    } else {
      this.props.removeFavoriteFromCollection(collection, favorite);
    }
  }

  renderCollections() {
    const { collections = [], favorite = null } = this.props;

    return (
      <div className="param-box">
        <div className="switches">
          {
            _.orderBy(collections, ['title'], ['asc']).map((c) => {
              const value = favorite ? !!c.items.find(id => id === favorite.id) : false;

              return (
                <Checkbox
                  key={`switch-${c.id}`}
                  id={`switch-${c.id}`}
                  name={`switch-${c.id}`}
                  text={c.title}
                  value={value}
                  readOnly={false}
                  onChange={(checked) => this.onCollectionToggle(c, favorite, checked)}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      <Modal
        centered={true}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '600px' }}
        toggle={this.props.toggle}>

        <div className="collection-manager-modal">
          <a href="" className="close" onClick={(e) => { e.preventDefault(); this.props.toggle(); }}></a>

          <div className="form-title">
            <FormattedMessage id="collections.manager.title" />
          </div>

          <form>

            <div className="fields">
              <div className="fields-group">
                {this.renderCollections()}
              </div>
            </div>
          </form>

        </div>
      </Modal>
    );
  }
}

export default injectIntl(CollectionSelectModal);