const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export const buildApiUrl = (...pathSegments: String[]) => {
  /*
  Join BASE_URL + endpoint (or multiple endpoints)
  clean-up if there are duplicate '//' if we are joining the enpoint from the contant
  */
  return [BASE_URL, ...pathSegments].join("/").replace(/([^:]\/)\/+/g, "$1");
};
