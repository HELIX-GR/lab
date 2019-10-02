import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  Modal,
} from 'reactstrap';

import {
  FormattedMessage,
} from 'react-intl';

import {
  default as CkanAdvancedOptions,
} from './ckan-advanced-options';

class AdvancedSearchModal extends React.Component {

  constructor(props) {
    super(props);

    this.textInput = React.createRef();
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    minOptions: PropTypes.number,
    search: PropTypes.func.isRequired,
    setText: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    toggleFacet: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    minOptions: 4,
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  onTextChanged(text) {
    this.props.setText(text);
  }

  onSearch(e) {
    e.preventDefault();

    this.props.search();
  }

  render() {
    const { data: { facets, loading, text } } = this.props;
    const _t = this.context.intl.formatMessage;

    const catalogs = _t({ id: 'advanced-search.placeholder.lab' });

    return (
      <Modal
        centered={true}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '1024px' }}
        toggle={this.props.toggle}>

        <div className="advanced-search lab">
          <a href="" className="close" onClick={(e) => { e.preventDefault(); this.props.toggle(); }}></a>

          <div className="form-title">
            <FormattedMessage id="advanced-search.title" defaultMessage="Advanced Search" />
          </div>

          <form>
            <div className="text-center">
              <input
                type="text"
                autoComplete="off"
                className="search-text"
                name="search-text"
                placeholder={_t({ id: 'advanced-search.placeholder.prefix' }, { catalogs })}
                value={text}
                onChange={(e) => this.onTextChanged(e.target.value)}
                ref={this.textInput}
              />
            </div>

            <CkanAdvancedOptions
              config={this.props.config}
              facets={facets}
              minOptions={this.props.minOptions}
              toggleFacet={this.props.toggleFacet}
            />

            <section className="footer">
              <button
                type="submit"
                name="landing-search-button"
                className="landing-search-button"
                disabled={false}
                onClick={(e) => this.onSearch(e)}>
                <i className={loading ? 'fa fa-spin fa-spinner' : 'fa fa-search'}></i>
              </button>
            </section>
          </form>
        </div>
      </Modal>
    );
  }
}

export default AdvancedSearchModal;
