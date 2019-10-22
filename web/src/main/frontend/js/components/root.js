import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as ReactIntl from 'react-intl';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';

import {
  ErrorPages,
} from '../model';

import {
  Page403,
  Page404,
} from './pages';

import App from "./app.js";

//
// Add locale-specific data for each supported locale
//
// See: https://github.com/formatjs/react-intl/blob/master/docs/Upgrade-Guide.md#migrate-to-using-native-intl-apis
//

import 'intl-pluralrules';
import '@formatjs/intl-relativetimeformat/polyfill';

import '@formatjs/intl-relativetimeformat/dist/locale-data/el';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },


});
class Root extends React.Component {

  render() {
    var { locale, messages } = this.props;

    return (
      <ReactIntl.IntlProvider locale={locale} key={locale} messages={messages}>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Route path={ErrorPages.Forbidden} component={Page403} exact />
            <Route path={ErrorPages.NotFound} component={Page404} exact />
            <Route path="/" component={App} />
          </Switch>
        </MuiThemeProvider>
      </ReactIntl.IntlProvider>);
  }
}

Root.defaultProps = {
  locale: 'en-GB',
  messages: {},
};

const mapStateToProps = (state) => {
  const locale = state.i18n.locale;
  const messages = state.i18n.messages[locale];
  return { locale, messages };
};

const mapDispatchToProps = null;

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Root);