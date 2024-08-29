function getConfigs() {
  let configs = getLocalStorage("savedConfigs");

  if (!configs) {
    setLocalStorage("savedConfigs", {});
    return {};
  }

  return configs;
}

function getConfig(config, defaultValue = {}) {
  const data = getConfigs();

  if (!data[config]) {
    setConfigs(config, defaultValue);
  }

  return data[config];
}

function setConfigs(config, data) {
  const configs = getConfigs();

  configs[config] = data;

  setLocalStorage("savedConfigs", configs);
}
