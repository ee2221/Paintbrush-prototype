import React from 'react';
import Scene from './components/Scene';
import Toolbar from './components/Toolbar';
import ActionsToolbar from './components/ActionsToolbar';
import LayersPanel from './components/LayersPanel';
import ObjectProperties from './components/ObjectProperties';
import EditControls from './components/EditControls';
import CameraPerspectivePanel from './components/CameraPerspectivePanel';
import LightingPanel from './components/LightingPanel';

function App() {
  return (
    <div className="w-full h-screen relative">
      <Scene />
      <ActionsToolbar />
      <Toolbar />
      <LayersPanel />
      <ObjectProperties />
      <EditControls />
      <CameraPerspectivePanel />
      <LightingPanel />
    </div>
  );
}

export default App;