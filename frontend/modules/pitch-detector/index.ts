// Reexport the native module. On web, it will be resolved to PitchDetectorModule.web.ts
// and on native platforms to PitchDetectorModule.ts
export { default } from './src/PitchDetectorModule';
export { default as PitchDetectorView } from './src/PitchDetectorView';
export * from  './src/PitchDetector.types';
