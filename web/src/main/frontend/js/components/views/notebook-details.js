import * as React from 'react';
import * as ReactRedux from 'react-redux';

import moment from '../../moment-localized';
import URI from 'urijs';

import { injectIntl } from 'react-intl';

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
  addFavorite,
  removeFavorite,
} from '../../ducks/user';

import {
  FormattedMessage,
} from 'react-intl';

import {
  EnumCatalog,
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

const PARAM_ID = 'id';

class NotebookDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false
    };

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentWillMount() {
    const { match: { params: { [PARAM_ID]: id } } } = this.props;

    this.scrollToTop();
    this.props.searchById(id);
  }

  get organizationLogo() {
    const { ckan, search: { notebook: n } } = this.props;

    if (n && n.organization) {
      const image = n.organization.image_url;
      if (image) {
        const url = image.startsWith('http') ? image : `${ckan.host}/uploads/group/${image}`;

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

  isFavoriteActive(handle) {
    return !!this.props.favorites.find(f => f.catalog === EnumCatalog.LAB && f.handle === handle);
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
          toast.error(<FormattedMessage id={`favorite.${active ? 'remove' : 'add'}-error-publication`} />);
        });
    } else {
      toast.dismiss();
      toast.error(<FormattedMessage id='favorite.login-required' />);
    }
  }

  onSearchTag(e, tag) {
    e.preventDefault();

    this.props.searchAll(tag);
    this.props.history.push(StaticRoutes.RESULTS);
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  getViewerUrl() {
    const { ckan, search: { notebook: n } } = this.props;
    const url = n && n.resources && n.resources.length === 1 ? n.resources[0].url : null;

    if (!url) {
      return null;
    }

    const ckanHost = URI(ckan.host);
    const target = URI(url);

    return `${StaticRoutes.NOTEBOOK_VIEWER}/url/${ckanHost.authority()}${target.path()}`;
  }

  scrollToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  getNotebookToFilesystem(id) {
    this.props.getNotebookToFilesystem(id)
      .then(toast.success("Notebook saved in you filesystem!"));
  }

  render() {
    const { ckan, search: { notebook: n }, match: { params: { [PARAM_ID]: id } } } = this.props;
    const _t = this.props.intl.formatMessage;

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
                      catalog={EnumCatalog.LAB}
                      description={n.notes}
                      handle={n.id}
                      onClick={this.toggleFavorite}
                      title={n.title}
                      url={`${ckan.host}/dataset/${n.id}`}
                    />
                    {this.props.username &&
                      <React.Fragment>
                        <div className="btn-save" id="img-btn-save">
                          <a onClick={() => this.getNotebookToFilesystem(id)} data-toggle="tooltip" data-placement="bottom" title="">
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
  ckan: state.config.ckan,
  favorites: state.user.profile ? state.user.profile.favorites : [],
  profile: state.user.profile,
  search: state.ui.search,
  username: state.user.username,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addFavorite,
  getNotebookToFilesystem,
  removeFavorite,
  searchAll,
  searchById,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

const localizedComponent = injectIntl(NotebookDetails);

export default NotebookDetails = ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(localizedComponent);
