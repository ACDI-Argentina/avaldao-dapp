import React, { useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
import config from '../configuration';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
  const location = useLocation();
  const prevLocation = useRef(location);

 // To check config settings

  useEffect(() => {
    // Initialize Google Analytics on mount
    if (config.analytics.useGoogleAnalytics) {
      console.log("INITIALIZE GA");
      console.log(`Google analytics initialized with config:`, config.analytics);
      ReactGA.initialize(config.analytics.ga_UA, {
        debug: false,
        ...config.analytics.options, // Using config directly instead of options prop
      });
    }

    // Log the initial page load
    const { pathname, search } = location;
    logPageChange(pathname, search);

    // Store current location
    prevLocation.current = location;
  }, []); // Run only on mount

  useEffect(() => {
    const { pathname, search } = location;
    const isDifferentPathname = pathname !== prevLocation.current.pathname;
    const isDifferentSearch = search !== prevLocation.current.search;

    if (isDifferentPathname || isDifferentSearch) {
      logPageChange(pathname, search);
    }

    prevLocation.current = location;
  }, [location]); // Run whenever location changes

  const logPageChange = (pathname, search = '') => {
    const page = pathname + search;
    const { origin } = window.location;
    ReactGA.set({
      page,
      location: `${origin}${page}`,
      ...config.analytics.options, // Using config directly here as well
    });
    ReactGA.pageview(page);
  };

  return null; // Not rendering any UI, just subscribing to location changes
};


export default GoogleAnalytics;
