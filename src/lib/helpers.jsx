import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import 'whatwg-fetch';
import { createBrowserHistory } from 'history';
import moment from 'moment';

export const history = createBrowserHistory();

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Get start of the day in UTC for a given date or start of current day in UTC
export const getStartOfDayUTC = date => moment.utc(date || moment()).startOf('day');

// the back button will go one lower nested route inside of the DApp
// removes the last pathname from the url and pushes that location

export const goBackOnePath = () => {
  let url = history.location.pathname.split('/');
  url.pop();
  url = url.join('/');
  history.push(url);
};

/**
 * If path is an ipfsUrl, return just the ipfs path, otherwise returns the path param
 *
 * @param {string} path the path to clean
 */
export const cleanIpfsPath = path => {
  const re = new RegExp(/\/ipfs\/\w+$/);
  const match = re.exec(path);
  if (match) {
    return match[0];
  }
  return path;
};