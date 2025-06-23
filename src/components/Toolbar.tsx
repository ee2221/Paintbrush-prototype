import React, { useState } from 'react';
import { 
  Move, 
  RotateCw, 
  Maximize, 
  Projector as Vector, 
  Link,
  Cuboid, 
  Cherry, 
  Cylinder, 
  Cone, 
  Pyramid, 
  ChevronDown,
  ChevronRight,
  TreePine,
  Flower,
  Leaf,
  Mountain,
  Home,
  Coffee,
  Lightbulb,
  Heart,
  Star,
  Hexagon,
  Triangle,
  Circle,
  Square,
  Diamond,
  Zap,
  Type,
  X
} from 'lucide-react';
import { useSceneStore } from '../store/sceneStore';
import * as THREE from 'three';

interface ObjectCategory {
  name: string;
  icon: React.ComponentType<any>;
  objects: {
    name: string;
    icon: React.ComponentType<any>;
    geometry: () => THREE.BufferGeometry | THREE.Group;
    color?: string;
  }[];
}

const Toolbar: React.FC = () => {
  const { 
    setTransformMode, 
    transformMode, 
    setEditMode,
    editMode,
    selectedObject,
    placementMode,
    startObjectPlacement,
    cancelObjectPlacement
  } = useSceneStore();

  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Basic Shapes']);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputData, setTextInputData] = useState({
    text: 'Hello World',
    size: 1,
    height: 0.2,
    font: 'Arial',
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelSegments: 3
  });

  // Helper function to create 3D text geometry
  const create3DTextGeometry = (options: typeof textInputData) => {
    return new Promise<THREE.ExtrudeGeometry>((resolve) => {
      // Create a canvas to measure text and create the shape
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      // Set font for measurement
      const fontSize = 100; // Base size for high resolution
      context.font = `${fontSize}px ${options.font}`;
      
      // Measure text
      const metrics = context.measureText(options.text);
      const textWidth = metrics.width;
      const textHeight = fontSize;
      
      // Set canvas size
      canvas.width = textWidth + 40; // Add padding
      canvas.height = textHeight + 40;
      
      // Clear and set font again (canvas resize clears it)
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = `${fontSize}px ${options.font}`;
      context.fillStyle = 'white';
      context.textAlign = 'left';
      context.textBaseline = 'top';
      
      // Draw text
      context.fillText(options.text, 20, 20);
      
      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Create shape from text outline
      const shape = new THREE.Shape();
      const paths: THREE.Vector2[][] = [];
      let currentPath: THREE.Vector2[] = [];
      
      // Simple edge detection to create outline
      const threshold = 128;
      const scale = options.size / fontSize; // Scale factor
      
      // Find contours (simplified approach)
      const visited = new Set<string>();
      
      for (let y = 0; y < canvas.height; y += 2) { // Skip pixels for performance
        for (let x = 0; x < canvas.width; x += 2) {
          const key = `${x},${y}`;
          if (visited.has(key)) continue;
          
          const alpha = imageData.data[(y * canvas.width + x) * 4 + 3];
          
          if (alpha > threshold) {
            // Found a pixel, trace the edge
            const contour = traceContour(imageData, x, y, canvas.width, canvas.height, threshold, visited);
            if (contour.length > 10) { // Only use significant contours
              paths.push(contour.map(point => new THREE.Vector2(
                (point.x - canvas.width / 2) * scale,
                -(point.y - canvas.height / 2) * scale // Flip Y axis
              )));
            }
          }
        }
      }
      
      // Create shape from the largest contour (main text outline)
      if (paths.length > 0) {
        const mainPath = paths.reduce((largest, current) => 
          current.length > largest.length ? current : largest
        );
        
        if (mainPath.length > 0) {
          shape.moveTo(mainPath[0].x, mainPath[0].y);
          for (let i = 1; i < mainPath.length; i++) {
            shape.lineTo(mainPath[i].x, mainPath[i].y);
          }
          shape.closePath();
          
          // Add holes for other paths (like inside of 'O', 'P', etc.)
          paths.forEach(path => {
            if (path !== mainPath && path.length > 5) {
              const hole = new THREE.Path();
              hole.moveTo(path[0].x, path[0].y);
              for (let i = 1; i < path.length; i++) {
                hole.lineTo(path[i].x, path[i].y);
              }
              hole.closePath();
              shape.holes.push(hole);
            }
          });
        }
      }
      
      // Fallback: create simple rectangular shape if no contours found
      if (paths.length === 0) {
        const width = textWidth * scale;
        const height = textHeight * scale;
        shape.moveTo(-width/2, -height/2);
        shape.lineTo(width/2, -height/2);
        shape.lineTo(width/2, height/2);
        shape.lineTo(-width/2, height/2);
        shape.closePath();
      }
      
      // Create extrude geometry
      const extrudeSettings = {
        depth: options.height,
        bevelEnabled: options.bevelEnabled,
        bevelThickness: options.bevelThickness,
        bevelSize: options.bevelSize,
        bevelSegments: options.bevelSegments
      };
      
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center(); // Center the geometry
      
      resolve(geometry);
    });
  };

  // Simple contour tracing function
  const traceContour = (
    imageData: ImageData, 
    startX: number, 
    startY: number, 
    width: number, 
    height: number, 
    threshold: number,
    visited: Set<string>
  ): { x: number; y: number }[] => {
    const contour: { x: number; y: number }[] = [];
    const directions = [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
      { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }
    ];
    
    let x = startX;
    let y = startY;
    let dirIndex = 0;
    const maxSteps = 1000; // Prevent infinite loops
    let steps = 0;
    
    do {
      contour.push({ x, y });
      visited.add(`${x},${y}`);
      
      // Find next edge pixel
      let found = false;
      for (let i = 0; i < 8; i++) {
        const newDirIndex = (dirIndex + i) % 8;
        const dir = directions[newDirIndex];
        const newX = x + dir.x;
        const newY = y + dir.y;
        
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          const alpha = imageData.data[(newY * width + newX) * 4 + 3];
          if (alpha > threshold) {
            x = newX;
            y = newY;
            dirIndex = newDirIndex;
            found = true;
            break;
          }
        }
      }
      
      if (!found) break;
      steps++;
    } while ((x !== startX || y !== startY) && steps < maxSteps);
    
    return contour;
  };

  // Helper function to create tree geometry
  const createTreeGeometry = () => {
    const group = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.5;
    group.add(trunk);
    
    // Leaves (multiple spheres)
    const leafMaterial = new THREE.MeshStandardMaterial({ color: '#228B22' });
    for (let i = 0; i < 3; i++) {
      const leafGeometry = new THREE.SphereGeometry(0.4 - i * 0.1, 8, 6);
      const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
      leaves.position.y = 1.2 + i * 0.3;
      group.add(leaves);
    }
    
    return group;
  };

  // Helper function to create bush geometry
  const createBushGeometry = () => {
    const group = new THREE.Group();
    const leafMaterial = new THREE.MeshStandardMaterial({ color: '#32CD32' });
    
    // Multiple overlapping spheres for bush effect
    for (let i = 0; i < 5; i++) {
      const leafGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 8, 6);
      const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
      leaves.position.set(
        (Math.random() - 0.5) * 0.8,
        Math.random() * 0.4,
        (Math.random() - 0.5) * 0.8
      );
      group.add(leaves);
    }
    
    return group;
  };

  // Helper function to create flower geometry
  const createFlowerGeometry = () => {
    const group = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: '#228B22' });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.4;
    group.add(stem);
    
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    const centerMaterial = new THREE.MeshStandardMaterial({ color: '#FFD700' });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.8;
    group.add(center);
    
    // Petals
    const petalMaterial = new THREE.MeshStandardMaterial({ color: '#FF69B4' });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const petalGeometry = new THREE.SphereGeometry(0.06, 6, 4);
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      petal.position.set(
        Math.cos(angle) * 0.12,
        0.8,
        Math.sin(angle) * 0.12
      );
      group.add(petal);
    }
    
    return group;
  };

  // Helper function to create rock geometry
  const createRockGeometry = () => {
    const geometry = new THREE.DodecahedronGeometry(0.5);
    // Add some randomness to vertices for organic look
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      );
      vertex.multiplyScalar(0.8 + Math.random() * 0.4);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geometry.computeVertexNormals();
    return geometry;
  };

  const objectCategories: ObjectCategory[] = [
    {
      name: 'Basic Shapes',
      icon: Cuboid,
      objects: [
        {
          name: 'Cube',
          icon: Cuboid,
          geometry: () => new THREE.BoxGeometry(1, 1, 1),
        },
        {
          name: 'Sphere',
          icon: Cherry,
          geometry: () => new THREE.SphereGeometry(0.5, 32, 16),
        },
        {
          name: 'Cylinder',
          icon: Cylinder,
          geometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
        },
        {
          name: 'Cone',
          icon: Cone,
          geometry: () => new THREE.ConeGeometry(0.5, 1, 32),
        },
        {
          name: 'Tetrahedron',
          icon: Pyramid,
          geometry: () => new THREE.TetrahedronGeometry(0.7),
        },
        {
          name: 'Torus',
          icon: Circle,
          geometry: () => new THREE.TorusGeometry(0.5, 0.2, 16, 100),
        },
        {
          name: 'Octahedron',
          icon: Diamond,
          geometry: () => new THREE.OctahedronGeometry(0.6),
        },
        {
          name: 'Dodecahedron',
          icon: Hexagon,
          geometry: () => new THREE.DodecahedronGeometry(0.5),
        }
      ]
    },
    {
      name: 'Text & Typography',
      icon: Type,
      objects: [
        {
          name: '3D Text',
          icon: Type,
          geometry: () => {
            // This will be handled specially in the click handler
            return new THREE.BoxGeometry(1, 0.2, 0.1); // Placeholder
          },
          color: '#4A90E2'
        }
      ]
    },
    {
      name: 'Nature & Organic',
      icon: TreePine,
      objects: [
        {
          name: 'Tree',
          icon: TreePine,
          geometry: createTreeGeometry,
          color: '#228B22'
        },
        {
          name: 'Bush',
          icon: Leaf,
          geometry: createBushGeometry,
          color: '#32CD32'
        },
        {
          name: 'Flower',
          icon: Flower,
          geometry: createFlowerGeometry,
          color: '#FF69B4'
        },
        {
          name: 'Rock',
          icon: Mountain,
          geometry: createRockGeometry,
          color: '#696969'
        }
      ]
    },
    {
      name: 'Architecture',
      icon: Home,
      objects: [
        {
          name: 'House Base',
          icon: Home,
          geometry: () => new THREE.BoxGeometry(2, 1, 1.5),
          color: '#D2691E'
        },
        {
          name: 'Pillar',
          icon: Square,
          geometry: () => new THREE.CylinderGeometry(0.2, 0.2, 2, 12),
          color: '#F5F5DC'
        },
        {
          name: 'Roof',
          icon: Triangle,
          geometry: () => new THREE.ConeGeometry(1.2, 0.8, 4),
          color: '#8B0000'
        }
      ]
    },
    {
      name: 'Decorative',
      icon: Star,
      objects: [
        {
          name: 'Star',
          icon: Star,
          geometry: () => {
            const shape = new THREE.Shape();
            const outerRadius = 0.5;
            const innerRadius = 0.2;
            const points = 5;
            
            for (let i = 0; i < points * 2; i++) {
              const angle = (i / (points * 2)) * Math.PI * 2;
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              if (i === 0) {
                shape.moveTo(x, y);
              } else {
                shape.lineTo(x, y);
              }
            }
            
            return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
          },
          color: '#FFD700'
        },
        {
          name: 'Heart',
          icon: Heart,
          geometry: () => {
            const shape = new THREE.Shape();
            const x = 0, y = 0;
            shape.moveTo(x, y);
            shape.bezierCurveTo(x, y - 0.3, x - 0.6, y - 0.3, x - 0.6, y);
            shape.bezierCurveTo(x - 0.6, y + 0.3, x, y + 0.6, x, y + 1);
            shape.bezierCurveTo(x, y + 0.6, x + 0.6, y + 0.3, x + 0.6, y);
            shape.bezierCurveTo(x + 0.6, y - 0.3, x, y - 0.3, x, y);
            
            return new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.02 });
          },
          color: '#FF1493'
        },
        {
          name: 'Lightning',
          icon: Zap,
          geometry: () => {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0.8);
            shape.lineTo(-0.2, 0.2);
            shape.lineTo(0.1, 0.2);
            shape.lineTo(-0.1, -0.8);
            shape.lineTo(0.2, -0.2);
            shape.lineTo(-0.1, -0.2);
            shape.closePath();
            
            return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
          },
          color: '#FFFF00'
        }
      ]
    },
    {
      name: 'Everyday Objects',
      icon: Coffee,
      objects: [
        {
          name: 'Mug',
          icon: Coffee,
          geometry: () => {
            const group = new THREE.Group();
            
            // Main body
            const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.6, 16);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#FFFFFF' });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.3;
            group.add(body);
            
            // Handle
            const handleGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16, Math.PI);
            const handleMaterial = new THREE.MeshStandardMaterial({ color: '#FFFFFF' });
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            handle.position.set(0.35, 0.3, 0);
            handle.rotation.z = Math.PI / 2;
            group.add(handle);
            
            return group;
          },
          color: '#FFFFFF'
        },
        {
          name: 'Light Bulb',
          icon: Lightbulb,
          geometry: () => {
            const group = new THREE.Group();
            
            // Bulb
            const bulbGeometry = new THREE.SphereGeometry(0.3, 16, 12);
            const bulbMaterial = new THREE.MeshStandardMaterial({ color: '#FFFACD', transparent: true, opacity: 0.8 });
            const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
            bulb.position.y = 0.3;
            group.add(bulb);
            
            // Base
            const baseGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.2, 12);
            const baseMaterial = new THREE.MeshStandardMaterial({ color: '#C0C0C0' });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = -0.1;
            group.add(base);
            
            return group;
          },
          color: '#FFFACD'
        }
      ]
    }
  ];

  const transformTools = [
    {
      icon: Move,
      mode: 'translate',
      title: 'Move Tool',
      type: 'transform'
    },
    {
      icon: RotateCw,
      mode: 'rotate',
      title: 'Rotate Tool',
      type: 'transform'
    },
    {
      icon: Maximize,
      mode: 'scale',
      title: 'Scale Tool',
      type: 'transform'
    },
  ] as const;

  // Check if edge editing should be disabled for the current object
  const isEdgeEditingDisabled = () => {
    if (!selectedObject || !(selectedObject instanceof THREE.Mesh)) return true;
    
    const geometry = selectedObject.geometry;
    return (
      geometry instanceof THREE.CylinderGeometry ||
      geometry instanceof THREE.ConeGeometry ||
      geometry instanceof THREE.SphereGeometry
    );
  };

  const editTools = [
    {
      icon: Vector,
      mode: 'vertex',
      title: 'Edit Vertices',
      type: 'edit',
      disabled: false
    },
    {
      icon: Link,
      mode: 'edge',
      title: 'Edit Edges',
      type: 'edit',
      disabled: isEdgeEditingDisabled()
    }
  ] as const;

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleObjectCreate = async (objectDef: any) => {
    // Special handling for 3D Text
    if (objectDef.name === '3D Text') {
      setShowTextInput(true);
      return;
    }

    // Start placement mode for other objects
    startObjectPlacement(objectDef);
  };

  const handleCreateText = async () => {
    try {
      // Create the 3D text geometry
      const geometry = await create3DTextGeometry(textInputData);
      
      // Create the text object definition
      const textObjectDef = {
        name: `Text: ${textInputData.text}`,
        geometry: () => geometry,
        color: '#4A90E2'
      };

      // Start placement mode with the text
      startObjectPlacement(textObjectDef);
      setShowTextInput(false);
    } catch (error) {
      console.error('Error creating 3D text:', error);
      // Fallback to simple box if text creation fails
      const fallbackDef = {
        name: `Text: ${textInputData.text}`,
        geometry: () => new THREE.BoxGeometry(textInputData.text.length * 0.5, 0.5, textInputData.height),
        color: '#4A90E2'
      };
      startObjectPlacement(fallbackDef);
      setShowTextInput(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 left-4 bg-[#1a1a1a] rounded-xl shadow-2xl shadow-black/20 p-3 border border-white/5 max-h-[85vh] overflow-y-auto">
        <div className="flex flex-col gap-3">
          {/* Placement Mode Indicator */}
          {placementMode && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Placement Mode</p>
                  <p className="text-white/70 text-xs">Click on the plane to place object</p>
                </div>
                <button
                  onClick={cancelObjectPlacement}
                  className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* 3D Object Library */}
          <div className="space-y-1 border-b border-white/10 pb-3">
            <div className="px-2 py-1">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">3D Objects</h3>
            </div>
            
            <div className="space-y-1">
              {objectCategories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    disabled={placementMode}
                    className={`w-full p-2 rounded-lg transition-colors flex items-center justify-between ${
                      placementMode 
                        ? 'text-white/30 cursor-not-allowed' 
                        : 'text-white/90 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    {expandedCategories.includes(category.name) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  
                  {expandedCategories.includes(category.name) && (
                    <div className="ml-4 grid grid-cols-2 gap-1 mt-1">
                      {category.objects.map((obj) => (
                        <button
                          key={obj.name}
                          onClick={() => handleObjectCreate(obj)}
                          disabled={placementMode}
                          className={`p-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${
                            placementMode
                              ? 'bg-[#2a2a2a] text-white/30 cursor-not-allowed'
                              : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white/90 hover:scale-105 active:scale-95'
                          }`}
                          title={placementMode ? 'Finish current placement first' : `Add ${obj.name}`}
                        >
                          <obj.icon className="w-4 h-4" />
                          <span className="text-xs font-medium text-center leading-tight">{obj.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transform Tools */}
          <div className="space-y-1 border-b border-white/10 pb-3">
            <div className="px-2 py-1">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Transform</h3>
            </div>
            {transformTools.map(({ icon: Icon, mode, title }) => (
              <button
                key={mode}
                onClick={() => {
                  if (!placementMode) {
                    setTransformMode(mode);
                    setEditMode(null);
                  }
                }}
                disabled={placementMode}
                className={`p-2 rounded-lg transition-colors w-full flex items-center gap-2 ${
                  placementMode
                    ? 'text-white/30 cursor-not-allowed'
                    : transformMode === mode && !editMode 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/90 hover:bg-white/5'
                }`}
                title={placementMode ? 'Finish current placement first' : title}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{title}</span>
              </button>
            ))}
          </div>

          {/* Edit Tools */}
          <div className="space-y-1">
            <div className="px-2 py-1">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Edit Mode</h3>
            </div>
            {editTools.map(({ icon: Icon, mode, title, disabled }) => (
              <button
                key={mode}
                onClick={() => {
                  if (!disabled && !placementMode) {
                    setEditMode(mode);
                    setTransformMode(null);
                  }
                }}
                disabled={disabled || placementMode}
                className={`p-2 rounded-lg transition-colors w-full flex items-center gap-2 ${
                  disabled || placementMode
                    ? 'text-white/30 cursor-not-allowed'
                    : editMode === mode 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/90 hover:bg-white/5'
                }`}
                title={
                  placementMode 
                    ? 'Finish current placement first'
                    : disabled 
                      ? `${title} (Not available for this object type)` 
                      : title
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Text Input Modal */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-400" />
                Create 3D Text
              </h2>
              <button
                onClick={() => setShowTextInput(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Text</label>
                <input
                  type="text"
                  value={textInputData.text}
                  onChange={(e) => setTextInputData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-blue-500/50"
                  placeholder="Enter your text..."
                  autoFocus
                />
              </div>

              {/* Font Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Font</label>
                <select
                  value={textInputData.font}
                  onChange={(e) => setTextInputData(prev => ({ ...prev, font: e.target.value }))}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Impact">Impact</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Size: {textInputData.size.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={textInputData.size}
                  onChange={(e) => setTextInputData(prev => ({ ...prev, size: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Extrude Depth */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Depth: {textInputData.height.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={textInputData.height}
                  onChange={(e) => setTextInputData(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Bevel Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/70">Enable Bevel</label>
                  <button
                    onClick={() => setTextInputData(prev => ({ ...prev, bevelEnabled: !prev.bevelEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      textInputData.bevelEnabled ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        textInputData.bevelEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {textInputData.bevelEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Bevel Thickness: {textInputData.bevelThickness.toFixed(3)}
                      </label>
                      <input
                        type="range"
                        min="0.005"
                        max="0.1"
                        step="0.005"
                        value={textInputData.bevelThickness}
                        onChange={(e) => setTextInputData(prev => ({ ...prev, bevelThickness: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Bevel Size: {textInputData.bevelSize.toFixed(3)}
                      </label>
                      <input
                        type="range"
                        min="0.005"
                        max="0.05"
                        step="0.005"
                        value={textInputData.bevelSize}
                        onChange={(e) => setTextInputData(prev => ({ ...prev, bevelSize: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Bevel Segments: {textInputData.bevelSegments}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={textInputData.bevelSegments}
                        onChange={(e) => setTextInputData(prev => ({ ...prev, bevelSegments: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTextInput(false)}
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white/90 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateText}
                  disabled={!textInputData.text.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    textInputData.text.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Create Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Toolbar;