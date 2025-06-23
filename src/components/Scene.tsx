import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid } from '@react-three/drei';
import { useSceneStore } from '../store/sceneStore';
import LightHelpers from './LightHelpers';
import * as THREE from 'three';

const VertexCoordinates = ({ position, onPositionChange }) => {
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (position) {
      setLocalPosition({
        x: parseFloat(position.x.toFixed(3)),
        y: parseFloat(position.y.toFixed(3)),
        z: parseFloat(position.z.toFixed(3))
      });
    }
  }, [position]);

  if (!position) return null;

  const handleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newLocalPosition = { ...localPosition, [axis]: numValue };
    setLocalPosition(newLocalPosition);
    
    const newPosition = new THREE.Vector3(
      newLocalPosition.x,
      newLocalPosition.y,
      newLocalPosition.z
    );
    onPositionChange(newPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent, axis: 'x' | 'y' | 'z') => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="absolute right-4 bottom-4 bg-black/90 text-white p-4 rounded-lg font-mono border border-white/20">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-white/70">Vertex Position</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="w-8 text-sm font-medium">X:</label>
          <input
            type="number"
            value={localPosition.x}
            onChange={(e) => handleChange('x', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'x')}
            className="bg-gray-800 px-2 py-1 rounded w-24 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-700"
            step="0.1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-8 text-sm font-medium">Y:</label>
          <input
            type="number"
            value={localPosition.y}
            onChange={(e) => handleChange('y', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'y')}
            className="bg-gray-800 px-2 py-1 rounded w-24 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-700"
            step="0.1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-8 text-sm font-medium">Z:</label>
          <input
            type="number"
            value={localPosition.z}
            onChange={(e) => handleChange('z', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'z')}
            className="bg-gray-800 px-2 py-1 rounded w-24 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-700"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};

const EdgeCoordinates = ({ position, onPositionChange }) => {
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (position) {
      setLocalPosition({
        x: parseFloat(position.x.toFixed(3)),
        y: parseFloat(position.y.toFixed(3)),
        z: parseFloat(position.z.toFixed(3))
      });
    }
  }, [position]);

  if (!position) return null;

  const handleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newLocalPosition = { ...localPosition, [axis]: numValue };
    setLocalPosition(newLocalPosition);
    
    const newPosition = new THREE.Vector3(
      newLocalPosition.x,
      newLocalPosition.y,
      newLocalPosition.z
    );
    onPositionChange(newPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent, axis: 'x' | 'y' | 'z') => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="absolute right-4 bottom-4 bg-black/90 text-white p-4 rounded-lg font-mono border border-white/20">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-white/70">Edge Midpoint</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="w-8 text-sm font-medium">X:</label>
          <input
            type="number"
            value={localPosition.x}
            onChange={(e) => handleChange('x', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'x')}
            className="bg-gray-800 px-2 py-1 rounded w-24 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-700"
            step="0.1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-8 text-sm font-medium">Y:</label>
          <input
            type="number"
            value={localPosition.y}
            onChange={(e) => handleChange('y', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'y')}
            className="bg-gray-800 px-2 py-1 rounded w-24 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-700"
            step="0.1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-8 text-sm font-medium">Z:</label>
          <input
            type="number"
            value={localPosition.z}
            onChange={(e) => handleChange('z', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'z')}
            className="bg-gray-800 px-2 py-1 rounded w-24 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-700"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};

const VertexCountSelector = () => {
  const { selectedObject, updateCylinderVertices, updateSphereVertices, isObjectLocked } = useSceneStore();

  if (!(selectedObject instanceof THREE.Mesh)) {
    return null;
  }

  // Check if object is locked
  const selectedObj = useSceneStore.getState().objects.find(obj => obj.object === selectedObject);
  if (selectedObj && isObjectLocked(selectedObj.id)) {
    return null;
  }

  const isCylinder = selectedObject.geometry instanceof THREE.CylinderGeometry;
  const isSphere = selectedObject.geometry instanceof THREE.SphereGeometry;

  if (!isCylinder && !isSphere) {
    return null;
  }

  let currentVertexCount;
  let options;
  let onChange;

  if (isCylinder) {
    currentVertexCount = selectedObject.geometry.parameters.radialSegments;
    options = [
      { value: 32, label: '32 Vertices' },
      { value: 16, label: '16 Vertices' },
      { value: 8, label: '8 Vertices' }
    ];
    onChange = updateCylinderVertices;
  } else {
    currentVertexCount = selectedObject.geometry.parameters.widthSegments;
    options = [
      { value: 64, label: '64 Vertices' },
      { value: 32, label: '32 Vertices' },
      { value: 16, label: '16 Vertices' },
      { value: 8, label: '8 Vertices' }
    ];
    onChange = updateSphereVertices;
  }

  return (
    <div className="absolute left-1/2 top-4 -translate-x-1/2 bg-black/75 text-white p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Vertex Count:</label>
        <select
          className="bg-gray-800 px-3 py-1.5 rounded text-sm"
          onChange={(e) => onChange(parseInt(e.target.value))}
          value={currentVertexCount}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const VertexPoints = ({ geometry, object }) => {
  const { editMode, selectedElements, startVertexDrag, isObjectLocked } = useSceneStore();
  const positions = geometry.attributes.position;
  const vertices = [];
  const worldMatrix = object.matrixWorld;
  
  // Check if object is locked
  const selectedObj = useSceneStore.getState().objects.find(obj => obj.object === object);
  const objectLocked = selectedObj ? isObjectLocked(selectedObj.id) : false;
  
  for (let i = 0; i < positions.count; i++) {
    const vertex = new THREE.Vector3(
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i)
    ).applyMatrix4(worldMatrix);
    vertices.push(vertex);
  }

  return editMode === 'vertex' ? (
    <group>
      {vertices.map((vertex, i) => (
        <mesh
          key={i}
          position={vertex}
          onClick={(e) => {
            e.stopPropagation();
            if (editMode === 'vertex' && !objectLocked) {
              startVertexDrag(i, vertex);
            }
          }}
        >
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial
            color={objectLocked ? 'gray' : (selectedElements.vertices.includes(i) ? 'red' : 'yellow')}
            transparent
            opacity={objectLocked ? 0.3 : 0.5}
          />
        </mesh>
      ))}
    </group>
  ) : null;
};

const EdgeLines = ({ geometry, object }) => {
  const { 
    editMode, 
    draggedEdge, 
    startEdgeDrag, 
    isDraggingEdge, 
    setIsDraggingEdge, 
    endEdgeDrag,
    selectedElements,
    isObjectLocked
  } = useSceneStore();
  const { camera, raycaster, pointer } = useThree();
  const positions = geometry.attributes.position;
  const edges = [];
  const worldMatrix = object.matrixWorld;
  const plane = useRef(new THREE.Plane());
  const intersection = useRef(new THREE.Vector3());

  // Check if object is locked
  const selectedObj = useSceneStore.getState().objects.find(obj => obj.object === object);
  const objectLocked = selectedObj ? isObjectLocked(selectedObj.id) : false;

  // Get all edges including vertical ones
  const indices = geometry.index ? Array.from(geometry.index.array) : null;
  
  if (indices) {
    // For indexed geometry
    for (let i = 0; i < indices.length; i += 3) {
      const addEdge = (a: number, b: number) => {
        const v1 = new THREE.Vector3(
          positions.getX(indices[a]),
          positions.getY(indices[a]),
          positions.getZ(indices[a])
        ).applyMatrix4(worldMatrix);

        const v2 = new THREE.Vector3(
          positions.getX(indices[b]),
          positions.getY(indices[b]),
          positions.getZ(indices[b])
        ).applyMatrix4(worldMatrix);

        const midpoint = v1.clone().add(v2).multiplyScalar(0.5);

        edges.push({
          vertices: [indices[a], indices[b]],
          positions: [v1, v2],
          midpoint
        });
      };

      // Add all three edges of the triangle
      addEdge(i, i + 1);
      addEdge(i + 1, i + 2);
      addEdge(i + 2, i);
    }
  } else {
    // For non-indexed geometry
    for (let i = 0; i < positions.count; i += 3) {
      const addEdge = (a: number, b: number) => {
        const v1 = new THREE.Vector3(
          positions.getX(a),
          positions.getY(a),
          positions.getZ(a)
        ).applyMatrix4(worldMatrix);

        const v2 = new THREE.Vector3(
          positions.getX(b),
          positions.getY(b),
          positions.getZ(b)
        ).applyMatrix4(worldMatrix);

        const midpoint = v1.clone().add(v2).multiplyScalar(0.5);

        edges.push({
          vertices: [a, b],
          positions: [v1, v2],
          midpoint
        });
      };

      // Add all three edges of the triangle
      addEdge(i, i + 1);
      addEdge(i + 1, i + 2);
      addEdge(i + 2, i);
    }
  }

  useEffect(() => {
    if (!isDraggingEdge || !draggedEdge || objectLocked) return;

    const handlePointerMove = (event) => {
      // Set up a plane perpendicular to camera for dragging
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      plane.current.setFromNormalAndCoplanarPoint(cameraDirection, draggedEdge.midpoint);

      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(plane.current, intersection.current)) {
        useSceneStore.getState().updateEdgeDrag(intersection.current);
      }
    };

    const handleRightClick = (event) => {
      if (event.button === 2) { // Right click
        event.preventDefault();
        setIsDraggingEdge(false);
        endEdgeDrag();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('contextmenu', handleRightClick);
    window.addEventListener('mousedown', handleRightClick);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('contextmenu', handleRightClick);
      window.removeEventListener('mousedown', handleRightClick);
    };
  }, [isDraggingEdge, draggedEdge, camera, raycaster, pointer, setIsDraggingEdge, endEdgeDrag, objectLocked]);

  const handleEdgeClick = (vertices: [number, number], positions: [THREE.Vector3, THREE.Vector3], midpoint: THREE.Vector3) => {
    if (objectLocked) return;
    // Single click to select and show coordinates
    startEdgeDrag(vertices, positions, midpoint);
  };

  const handleEdgeDoubleClick = (vertices: [number, number], positions: [THREE.Vector3, THREE.Vector3], midpoint: THREE.Vector3) => {
    if (objectLocked) return;
    // Double click to start dragging
    if (!isDraggingEdge) {
      setIsDraggingEdge(true);
      startEdgeDrag(vertices, positions, midpoint);
    }
  };

  return editMode === 'edge' ? (
    <group>
      {edges.map(({ vertices: [v1, v2], positions: [p1, p2], midpoint }, i) => {
        const points = [p1, p2];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const isSelected = draggedEdge?.indices.some(([a, b]) => 
          (a === v1 && b === v2) || (a === v2 && b === v1)
        );
        
        return (
          <group key={i}>
            <line geometry={geometry}>
              <lineBasicMaterial
                color={objectLocked ? 'gray' : (isSelected ? 'red' : 'yellow')}
                linewidth={isSelected ? 3 : 2}
                transparent={objectLocked}
                opacity={objectLocked ? 0.3 : 1}
              />
            </line>
            <mesh
              position={midpoint}
              onClick={(e) => {
                e.stopPropagation();
                handleEdgeClick([v1, v2], [p1, p2], midpoint);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleEdgeDoubleClick([v1, v2], [p1, p2], midpoint);
              }}
            >
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial
                color={objectLocked ? 'gray' : (isSelected ? 'red' : 'yellow')}
                transparent
                opacity={objectLocked ? 0.3 : (isSelected ? 0.9 : 0.7)}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  ) : null;
};

const EditModeOverlay = () => {
  const { 
    selectedObject, 
    editMode,
    setSelectedElements,
    draggedVertex,
    updateVertexDrag,
    endVertexDrag,
    isObjectLocked
  } = useSceneStore();
  const { scene, camera, raycaster, pointer } = useThree();
  const plane = useRef(new THREE.Plane());
  const intersection = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!selectedObject || !editMode || !(selectedObject instanceof THREE.Mesh)) return;

    // Check if object is locked
    const selectedObj = useSceneStore.getState().objects.find(obj => obj.object === selectedObject);
    const objectLocked = selectedObj ? isObjectLocked(selectedObj.id) : false;
    if (objectLocked) return;

    const handlePointerMove = (event) => {
      if (draggedVertex) {
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        plane.current.normal.copy(cameraDirection);
        plane.current.setFromNormalAndCoplanarPoint(
          cameraDirection,
          draggedVertex.position
        );

        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(plane.current, intersection.current)) {
          updateVertexDrag(intersection.current);
        }
      }
    };

    const handlePointerUp = () => {
      if (draggedVertex) {
        endVertexDrag();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    selectedObject,
    editMode,
    camera,
    raycaster,
    pointer,
    setSelectedElements,
    draggedVertex,
    updateVertexDrag,
    endVertexDrag,
    isObjectLocked
  ]);

  if (!selectedObject || !editMode || !(selectedObject instanceof THREE.Mesh)) return null;

  return (
    <>
      <VertexPoints geometry={selectedObject.geometry} object={selectedObject} />
      <EdgeLines geometry={selectedObject.geometry} object={selectedObject} />
    </>
  );
};

// Scene Lights Component
const SceneLights = () => {
  const { lights } = useSceneStore();

  return (
    <group>
      {lights.map(light => {
        if (!light.visible || !light.object) return null;
        
        return <primitive key={light.id} object={light.object} />;
      })}
    </group>
  );
};

// Camera controller component
const CameraController = () => {
  const { camera } = useThree();
  const { cameraPerspective, cameraZoom } = useSceneStore();
  const controlsRef = useRef();

  useEffect(() => {
    if (!camera || !controlsRef.current) return;

    const controls = controlsRef.current;
    const distance = 10 / cameraZoom; // Apply zoom to distance

    switch (cameraPerspective) {
      case 'front':
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      case 'back':
        camera.position.set(0, 0, -distance);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      case 'right':
        camera.position.set(distance, 0, 0);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      case 'left':
        camera.position.set(-distance, 0, 0);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      case 'top':
        camera.position.set(0, distance, 0);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 0, -1);
        break;
      case 'bottom':
        camera.position.set(0, -distance, 0);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 0, 1);
        break;
      case 'perspective':
      default:
        camera.position.set(5 / cameraZoom, 5 / cameraZoom, 5 / cameraZoom);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);
        break;
    }

    // Update controls target and position
    if (controls.target) {
      controls.target.set(0, 0, 0);
    }
    controls.update();
  }, [cameraPerspective, camera, cameraZoom]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle numpad keys when not typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

      const { setCameraPerspective } = useSceneStore.getState();

      switch (event.code) {
        case 'Numpad0':
          setCameraPerspective('perspective');
          break;
        case 'Numpad1':
          if (event.ctrlKey) {
            setCameraPerspective('back');
          } else {
            setCameraPerspective('front');
          }
          break;
        case 'Numpad3':
          if (event.ctrlKey) {
            setCameraPerspective('left');
          } else {
            setCameraPerspective('right');
          }
          break;
        case 'Numpad7':
          if (event.ctrlKey) {
            setCameraPerspective('bottom');
          } else {
            setCameraPerspective('top');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
    />
  );
};

// Placement helper component with improved stacking
const PlacementHelper = () => {
  const { placementMode, pendingObject, placeObjectAt, cancelObjectPlacement, objects } = useSceneStore();
  const { camera, raycaster, pointer, scene } = useThree();
  const [hoverPosition, setHoverPosition] = useState<THREE.Vector3 | null>(null);

  // Helper function to get bounding box of an object
  const getObjectBoundingBox = (object: THREE.Object3D) => {
    const box = new THREE.Box3();
    
    if (object instanceof THREE.Mesh) {
      box.setFromObject(object);
    } else if (object instanceof THREE.Group) {
      // For groups, compute bounding box of all children
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const childBox = new THREE.Box3().setFromObject(child);
          box.union(childBox);
        }
      });
    }
    
    return box;
  };

  // Helper function to get approximate bounding box for pending object
  const getPendingObjectBoundingBox = (position: THREE.Vector3) => {
    if (!pendingObject) return new THREE.Box3();

    const geometryOrGroup = pendingObject.geometry();
    let tempObject: THREE.Object3D;

    if (geometryOrGroup instanceof THREE.Group) {
      tempObject = geometryOrGroup.clone();
    } else {
      const material = new THREE.MeshStandardMaterial();
      tempObject = new THREE.Mesh(geometryOrGroup, material);
    }

    tempObject.position.copy(position);
    const box = getObjectBoundingBox(tempObject);
    
    // Clean up
    if (tempObject instanceof THREE.Mesh) {
      tempObject.geometry.dispose();
      (tempObject.material as THREE.Material).dispose();
    }

    return box;
  };

  // Find the highest surface to place object on (improved stacking logic)
  const findPlacementPosition = (intersectionPoint: THREE.Vector3) => {
    if (!pendingObject) return intersectionPoint;

    // Create a temporary object to get its dimensions
    const tempBox = getPendingObjectBoundingBox(intersectionPoint);
    const objectHeight = tempBox.max.y - tempBox.min.y;
    const objectWidth = tempBox.max.x - tempBox.min.x;
    const objectDepth = tempBox.max.z - tempBox.min.z;

    let highestY = 0; // Ground level
    const tolerance = 0.5; // How close objects need to be to stack

    // Check all visible objects for surfaces to place on
    for (const { object, visible } of objects) {
      if (!visible) continue;
      
      const objectBox = getObjectBoundingBox(object);
      
      // Check if the object is within stacking range (X-Z plane)
      const xOverlap = Math.abs(intersectionPoint.x - (objectBox.min.x + objectBox.max.x) / 2) < 
                      (objectWidth / 2 + (objectBox.max.x - objectBox.min.x) / 2 + tolerance);
      const zOverlap = Math.abs(intersectionPoint.z - (objectBox.min.z + objectBox.max.z) / 2) < 
                      (objectDepth / 2 + (objectBox.max.z - objectBox.min.z) / 2 + tolerance);
      
      if (xOverlap && zOverlap) {
        // This object could be a surface to place on
        const surfaceY = objectBox.max.y;
        if (surfaceY > highestY) {
          highestY = surfaceY;
        }
      }
    }

    // Place the object so its bottom sits on the highest surface
    const finalY = highestY + (objectHeight / 2);
    return new THREE.Vector3(intersectionPoint.x, finalY, intersectionPoint.z);
  };

  useEffect(() => {
    if (!placementMode) return;

    const handlePointerMove = (event) => {
      // Cast ray from camera through mouse position
      raycaster.setFromCamera(pointer, camera);
      
      // Create a large ground plane for intersection
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      
      // Also check intersections with existing objects
      const intersects = raycaster.intersectObjects(
        objects.filter(obj => obj.visible).map(obj => obj.object), 
        true
      );

      let targetPosition: THREE.Vector3;

      if (intersects.length > 0) {
        // Hit an existing object - use the intersection point
        targetPosition = intersects[0].point;
      } else if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
        // Hit the ground plane
        targetPosition = intersection;
      } else {
        return; // No valid intersection
      }

      // Find the best placement position (accounting for stacking)
      const placementPosition = findPlacementPosition(targetPosition);
      
      setHoverPosition(placementPosition);
    };

    const handleClick = (event) => {
      if (event.button === 0 && hoverPosition) { // Left click
        placeObjectAt(hoverPosition);
        setHoverPosition(null);
      }
    };

    const handleRightClick = (event) => {
      if (event.button === 2) { // Right click
        event.preventDefault();
        cancelObjectPlacement();
        setHoverPosition(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        cancelObjectPlacement();
        setHoverPosition(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('contextmenu', handleRightClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('contextmenu', handleRightClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [placementMode, hoverPosition, camera, raycaster, pointer, placeObjectAt, cancelObjectPlacement, objects, pendingObject]);

  if (!placementMode || !hoverPosition || !pendingObject) return null;

  // Create preview object
  const geometryOrGroup = pendingObject.geometry();
  let previewObject;

  if (geometryOrGroup instanceof THREE.Group) {
    previewObject = geometryOrGroup.clone();
  } else {
    const material = new THREE.MeshStandardMaterial({ 
      color: pendingObject.color || '#44aa88',
      transparent: true,
      opacity: 0.6
    });
    previewObject = new THREE.Mesh(geometryOrGroup, material);
  }

  return (
    <primitive 
      object={previewObject} 
      position={hoverPosition}
    />
  );
};

const Scene: React.FC = () => {
  const { 
    objects, 
    lights,
    selectedLight,
    selectedObject, 
    setSelectedObject, 
    transformMode, 
    editMode, 
    draggedVertex, 
    draggedEdge,
    selectedElements, 
    updateVertexDrag,
    updateEdgeDrag,
    canSelectObject,
    placementMode
  } = useSceneStore();
  const [selectedPosition, setSelectedPosition] = useState<THREE.Vector3 | null>(null);
  const [selectedEdgePosition, setSelectedEdgePosition] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (editMode === 'vertex' && selectedObject instanceof THREE.Mesh) {
      if (draggedVertex) {
        setSelectedPosition(draggedVertex.position);
      } else if (selectedElements.vertices.length > 0) {
        const geometry = selectedObject.geometry;
        const positions = geometry.attributes.position;
        const vertexIndex = selectedElements.vertices[0];
        const position = new THREE.Vector3(
          positions.getX(vertexIndex),
          positions.getY(vertexIndex),
          positions.getZ(vertexIndex)
        );
        position.applyMatrix4(selectedObject.matrixWorld);
        setSelectedPosition(position);
      } else {
        setSelectedPosition(null);
      }
    } else {
      setSelectedPosition(null);
    }
  }, [editMode, selectedObject, draggedVertex, selectedElements.vertices]);

  useEffect(() => {
    if (editMode === 'edge' && selectedObject instanceof THREE.Mesh) {
      if (draggedEdge) {
        setSelectedEdgePosition(draggedEdge.midpoint);
      } else {
        setSelectedEdgePosition(null);
      }
    } else {
      setSelectedEdgePosition(null);
    }
  }, [editMode, selectedObject, draggedEdge]);

  const handleVertexPositionChange = (newPosition: THREE.Vector3) => {
    if (selectedObject instanceof THREE.Mesh && draggedVertex) {
      // Convert world position back to local position
      const localPosition = newPosition.clone();
      const inverseMatrix = selectedObject.matrixWorld.clone().invert();
      localPosition.applyMatrix4(inverseMatrix);
      
      updateVertexDrag(localPosition);
      
      // Update the displayed position to match the world position
      setSelectedPosition(newPosition);
    }
  };

  const handleEdgePositionChange = (newPosition: THREE.Vector3) => {
    if (selectedObject instanceof THREE.Mesh && draggedEdge) {
      updateEdgeDrag(newPosition);
      setSelectedEdgePosition(newPosition);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        className="w-full h-full bg-gray-900"
        onContextMenu={(e) => e.preventDefault()} // Prevent default right-click menu
        shadows
      >
        {/* Default Scene Lighting - Always present for basic illumination */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* User-created Scene Lights */}
        <SceneLights />
        
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={3}
          fadeDistance={30}
          fadeStrength={1}
        />

        {objects.map(({ object, visible, id }) => (
          visible && (
            <primitive
              key={id}
              object={object}
              castShadow
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                if (!placementMode && canSelectObject(object)) {
                  setSelectedObject(object);
                }
              }}
            />
          )
        ))}

        {selectedObject && transformMode && canSelectObject(selectedObject) && !placementMode && (
          <TransformControls
            object={selectedObject}
            mode={transformMode}
          />
        )}

        <EditModeOverlay />
        <PlacementHelper />
        <LightHelpers lights={lights} selectedLight={selectedLight} />
        <CameraController />
      </Canvas>
      {editMode === 'vertex' && selectedPosition && (
        <VertexCoordinates 
          position={selectedPosition}
          onPositionChange={handleVertexPositionChange}
        />
      )}
      {editMode === 'edge' && selectedEdgePosition && (
        <EdgeCoordinates 
          position={selectedEdgePosition}
          onPositionChange={handleEdgePositionChange}
        />
      )}
      {editMode === 'vertex' && selectedObject && !(selectedObject.geometry instanceof THREE.ConeGeometry) && (
        <VertexCountSelector />
      )}
    </div>
  );
};

export default Scene;