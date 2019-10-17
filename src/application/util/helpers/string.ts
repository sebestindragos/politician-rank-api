/**
 * Namespace containing helper methods for
 * working with string values.
 */
export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

/**
 * Check if a string is a valid email address.
 */
export function isEmail(value: string) {
  /* tslint:disable */
  var emailRx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /* tslint:enable */
  return emailRx.test(value);
}
