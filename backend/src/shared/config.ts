export const PAGE_SIZE = 12;
export const QUERY_RESULTS_TTL = 60 * 60 * 10; // 10 hours

const developmentDomain = 'http://localhost:3031/v1/';
const productionDomain = 'http://35.198.147.242/v1/';
export const DOMAIN =
  process.env.NODE_ENV === 'development' ? developmentDomain : productionDomain;
