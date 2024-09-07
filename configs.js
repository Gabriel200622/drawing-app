/**
 * Retrieves the configuration object from localStorage.
 * If no configuration is found, an empty object is saved and returned.
 *
 * @function getConfigs
 * @returns {Object} The saved configuration object from localStorage, or an empty object if none exists.
 */
function getConfigs() {
  let configs = getLocalStorage("savedConfigs");

  // If no configs are found in localStorage, initialize with an empty object
  if (!configs) {
    setLocalStorage("savedConfigs", {});
    return {};
  }

  return configs;
}

/**
 * Retrieves a specific configuration by key.
 * If the configuration doesn't exist, it saves the default value provided and returns it.
 *
 * @function getConfig
 * @param {string} config - The key of the specific configuration to retrieve.
 * @param {*} [defaultValue={}] - The default value to save and return if the configuration does not exist.
 * @returns {*} The value of the requested configuration, or the default value if it doesn't exist.
 */
function getConfig(config, defaultValue = {}) {
  const data = getConfigs();

  // If the requested config does not exist, save the default value
  if (!data[config]) {
    setConfigs(config, defaultValue);
  }

  return data[config];
}

/**
 * Saves or updates a specific configuration in the stored configuration object.
 * The updated object is then saved back to localStorage.
 *
 * @function setConfigs
 * @param {string} config - The key of the configuration to be saved or updated.
 * @param {*} data - The value to save for the given configuration key.
 */
function setConfigs(config, data) {
  const configs = getConfigs();

  // Update the configuration with the new data
  configs[config] = data;

  // Save the updated configuration object to localStorage
  setLocalStorage("savedConfigs", configs);
}
