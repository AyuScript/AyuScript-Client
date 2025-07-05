export function saveFeature(key: string, value: any) {
  const features = JSON.parse(localStorage.getItem('BetterFlorrFeatures') ?? '{}');
  features[key] = value;
  localStorage.setItem('BetterFlorrFeatures', JSON.stringify(features));
}

export function loadFeature(key: string, defaultValue?: any) {
  try {
    const features = JSON.parse(localStorage.getItem('BetterFlorrFeatures') || '{}');
    return features[key] ?? defaultValue;
  } catch (e) {
    console.error('Failed to load feature:', e);
    return defaultValue;
  }
}

export function clearFeature(key: string) {
  const features = JSON.parse(localStorage.getItem('BetterFlorrFeatures') ?? '{}');
  delete features[key];
  localStorage.setItem('BetterFlorrFeatures', JSON.stringify(features));
}

export function clearAllFeatures() {
  localStorage.setItem('BetterFlorrFeatures', '{}');
}