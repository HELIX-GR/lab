export function cookieExists(name) {
  return (
    document.cookie.split(';').filter((item) => {
      return item.trim().indexOf(`${name}=`) === 0;
    }).length
  ) !== 0;
}

export function getCookieValue(name) {
  const re = new RegExp(`[; ]${name}=([^\\s;]*)`);
  const match = (' ' + document.cookie).match(re);

  return (name && match) ? unescape(match[1]) : null;
}

export function setCookieValue(name, value) {
  const domain = window.location.hostname;
  const expires = new Date();

  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `${name}=${value}; domain=${domain}; path=/; expires=${expires.toUTCString()}`;
}