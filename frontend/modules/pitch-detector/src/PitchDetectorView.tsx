import { requireNativeView } from 'expo';
import * as React from 'react';

import { PitchDetectorViewProps } from './PitchDetector.types';

const NativeView: React.ComponentType<PitchDetectorViewProps> =
  requireNativeView('PitchDetector');

export default function PitchDetectorView(props: PitchDetectorViewProps) {
  return <NativeView {...props} />;
}
