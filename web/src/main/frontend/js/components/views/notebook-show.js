import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';

import moment from '../../moment-localized';

import {
  bindActionCreators
} from 'redux';

import {
  getNotebookToFilesystem,
} from '../../ducks/notebook';

import {
  search as searchAll,
  searchById,
} from '../../ducks/search';

import {
  FormattedMessage,
} from 'react-intl';

import {
  StaticRoutes,
} from '../../model';

import {
  toast,
} from 'react-toastify';

import { Tooltip } from 'reactstrap';

import {
  Favorite,
  Tag,
} from '../helpers';

import {
  Code,
} from 'react-content-loader';

const PARAM_ID = 'uuid';

class NotebookShow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false
    };

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  componentWillMount() {
    const { match: { params: { [PARAM_ID]: id } } } = this.props;

    this.scrollToTop();
    this.props.searchById(id);
  }

  get organizationLogo() {
    const { search: { notebook: n } } = this.props;

    if (n && n.organization) {
      const image = n.organization.image_url;
      if (image) {
        const url = image.startsWith('http') ? image : `${StaticRoutes.CKAN}/uploads/group/${image}`;

        return (
          <div className="image">
            <a href="/organization/helix">
              <img src={url} width="200" alt={n.organization.title} />
            </a>
          </div>
        );
      }
      return n.organization.title;
    }
    return null;
  }

  get isLoading() {
    const { search: { loading, notebook: n } } = this.props;
    return ((!n) || (loading));
  }

  onSearchTag(e, tag) {
    e.preventDefault();

    this.props.searchAll(tag);
    this.props.history.push(StaticRoutes.RESULTS);
  }

  isFavoriteActive(handle) {
    return false;
    //return !!this.props.favorites.find(f => f.catalog === "LAB" && f.handle === handle);
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  toggleFavorite(data) {
    const authenticated = (this.props.profile != null);
    const active = this.isFavoriteActive(data.handle);

    if (authenticated) {
      (active ? this.props.removeFavorite(data) : this.props.addFavorite(data))
        .catch((err) => {
          if ((err.errors) && (err.errors[0].code.startsWith('FavoriteErrorCode.'))) {
            // Ignore
            return;
          }

          toast.dismiss();
          toast.error(<FormattedMessage id={`favorite.${active ? 'remove' : 'add'}-error-notebook`} />);
        });
    } else {
      toast.dismiss();
      toast.error(<FormattedMessage id='favorite.login-required' />);
    }
  }

  getViewerUrl() {
    const { search: { notebook: n } } = this.props;
    const url = n && n.resources && n.resources.length === 1 ? n.resources[0].url : null;
    if (!url) {
      return null;
    }

    return (StaticRoutes.NBVIEWER + "/url/" + url.replace("http://", "").replace("https://", ""));
  }

  scrollToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  handleSaveBtn = (uuid) => {
    this.props.getNotebookToFilesystem(uuid).then(toast.success("Saved in you filesystem!"));
    this.setState({
      active: false
    });
  }

  render() {
    const { search: { notebook: n }, match: { params: { [PARAM_ID]: id } } } = this.props;
    const _t = this.context.intl.formatMessage;

    if (this.isLoading) {
      return (
        <div className="results-lab">
          <section className="main-results-page-content">
            <div className="results-main-content">
              <section className="results-main-sidebar">
                <Code />
                <Code />
                <Code />
              </section>
              <section className="results-main-result-set">
                <Code />
                <Code />
                <Code />
              </section>
            </div>
          </section>
        </div >
      );
    }

    return (
      <div className="results-lab">
        <section className="main-results-page-content">
          <div className="results-main-content">

            <section className="results-main-sidebar">

              <h5 className="side-heading org-heading">{_t({ id: 'notebook.publisher' })}</h5>
              <section className="side-content">
                {this.organizationLogo}
              </section>

              <h5 className="side-heading">{_t({ id: 'notebook.subjects' })}</h5>
              <section className="side-tags">
                {n.tags &&
                  n.tags.sort().map(tag => (
                    <Tag key={tag} text={tag} onClick={(e, tag) => this.onSearchTag(e, tag)} />
                  ))
                }
              </section>

              {n.license_title &&
                <React.Fragment>
                  <h5 className="side-heading grayed">{_t({ id: 'notebook.license' })}</h5>
                  <section className="license">
                    <img className="facet-icon" src="/images/icons/various/license.svg" />
                    <a href={n.license_url} rel="dc:rights">{n.license_title}</a>
                    {n.isopen &&
                      < a href={n.license_url} title={_t({ id: 'notebook.open-data-license' })}>
                        <img className="open-data" src="/images/png/open-data.png" alt="[Open Data]" />
                      </a>
                    }
                  </section>
                </React.Fragment>
              }

            </section>

            <section className="results-main-result-set">

              <div className="breadcrumbs-pagination top">
                <div className="breadcrumbs">
                  <a className="breadcrumbs-part">{n.organization.title}</a>
                  <a className="breadcrumbs-part">{n.title}</a>
                </div>
              </div>

              <div className="main-results-border-bottom">
              </div>

              <div className="result-items clearfix">
                <div className="nav-bar">
                  <div>
                    <h1 className="package-title">
                      <a href={this.getViewerUrl()} target="_blank">{n.title}</a>
                    </h1>
                  </div>
                  <div className="result-icons">
                    <Favorite
                      active={this.isFavoriteActive(n.id)}
                      description={n.notes}
                      handle={n.id}
                      onClick={this.toggleFavorite}
                      title={n.title}
                      url={`https://lab.hellenicdataservice.gr/notebook/${n.id}`}
                    />
                    {this.props.username &&
                      <React.Fragment>
                        <div className="btn-save" id="img-btn-save">
                          <a onClick={() => this.props.getNotebookToFilesystem(id)} data-toggle="tooltip" data-placement="bottom" title="">
                            <img src="/images/png/save.png" />
                          </a>
                        </div>
                        <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target="img-btn-save" toggle={this.toggleTooltip}>
                          {_t({ id: 'tooltip.add-to-user-folder' })}
                        </Tooltip>
                      </React.Fragment>
                    }
                    {n.datacite &&
                      <div className="package-language">
                        <a href=''> {n.datacite.languagecode}</a>
                      </div>
                    }
                  </div>
                  <div className="dataset-dates">
                    <div className="title">{_t({ id: 'notebook.publication' })}</div>
                    <div className="date"> {moment(n.metadata_created).format('YYYY-MM-DD')}</div>
                    <div className="title">{_t({ id: 'notebook.last-revision' })}</div>
                    <div className="date"> {moment(n.metadata_modified).format('YYYY-MM-DD')}</div>
                  </div>
                  <div className="nav-menu">
                    <li className="active">
                      <a onClick={(e) => e.preventDefault()}>
                        <i className="fa fa-flask"></i>{_t({ id: 'notebook.notebook' })}
                      </a>
                    </li>
                  </div>
                </div>

                <div className="package-notes">
                  {n.notes}
                </div>

                <section className="package-resources ">
                  <div className="section-title">
                    <h5 className="inline">{_t({ id: 'notebook.resources' })}</h5>
                    <hr className="separator" />
                  </div>
                  <div className="package-resource-list">
                    {n.resources.length !== 0 &&
                      n.resources.map(resource => (
                        <li key={resource.id} className="resource-component clearfix" data-id={resource.id}>
                          <a className="resource-title" href={resource.url} title={resource.name}>
                            {resource.name}
                            <span className="format-label" property="dc:format" data-format={resource.format.toLowerCase()}></span>
                          </a>
                          <div className="btn-group ">
                            <a className=" btn-group-main" href={resource.url}>
                              {_t({ id: 'notebook.buttons.download' })}
                            </a>
                            <a className=" btn-group-main" href={this.getViewerUrl()} target="_blank">
                              {_t({ id: 'notebook.buttons.view' })}
                            </a>
                          </div>
                          <p className="description">
                            {resource.description || _t({ id: 'notebook.no-description' })}
                          </p>
                        </li>
                      ))
                    }
                  </div>
                </section>

              </div>
            </section>

          </div>
        </section>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  search: state.ui.search,
  username: state.user.username,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getNotebookToFilesystem,
  searchAll,
  searchById,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default NotebookShow = ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(NotebookShow);