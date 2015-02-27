"use strict";
/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /*
   *
   *
   */
  /**
   * Array of application names.
   */
  app_name : ['Tuning Live'],
  /**
   * Your New Relic license key. Will be overrided from 
   */
  license_key : '0a93487b4dee276327dfd3e293ab07739bf5e8d3',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'info'
  }
};
