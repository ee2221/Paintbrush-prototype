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

  // Simplified 3D text geometry creation using basic shapes
  const create3DTextGeometry = (options: typeof textInputData): THREE.Group => {
    const group = new THREE.Group();
    const text = options.text.toUpperCase();
    
    // Character width and spacing
    const charWidth = options.size * 0.6;
    const charSpacing = options.size * 0.1;
    const totalWidth = (text.length * charWidth) + ((text.length - 1) * charSpacing);
    
    // Start position (center the text)
    let xOffset = -totalWidth / 2;
    
    // Create each character as a simple extruded shape
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === ' ') {
        xOffset += charWidth + charSpacing;
        continue;
      }
      
      const charGeometry = createCharacterGeometry(char, options);
      if (charGeometry) {
        const material = new THREE.MeshStandardMaterial({ 
          color: '#4A90E2',
          metalness: 0.1,
          roughness: 0.3
        });
        
        const charMesh = new THREE.Mesh(charGeometry, material);
        charMesh.position.x = xOffset + charWidth / 2;
        group.add(charMesh);
      }
      
      xOffset += charWidth + charSpacing;
    }
    
    return group;
  };

  // Create geometry for individual characters using simple shapes
  const createCharacterGeometry = (char: string, options: typeof textInputData): THREE.ExtrudeGeometry | null => {
    const shape = new THREE.Shape();
    const size = options.size;
    const thickness = 0.1;
    
    // Define simple character shapes
    switch (char) {
      case 'A':
        // Triangle with crossbar
        shape.moveTo(-size * 0.3, 0);
        shape.lineTo(0, size * 0.8);
        shape.lineTo(size * 0.3, 0);
        shape.lineTo(size * 0.2, 0);
        shape.lineTo(size * 0.1, size * 0.3);
        shape.lineTo(-size * 0.1, size * 0.3);
        shape.lineTo(-size * 0.2, 0);
        shape.closePath();
        break;
        
      case 'B':
        // Rectangle with curves
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.25, size * 0.8, size * 0.25, size * 0.6);
        shape.quadraticCurveTo(size * 0.25, size * 0.4, size * 0.1, size * 0.4);
        shape.lineTo(size * 0.15, size * 0.4);
        shape.quadraticCurveTo(size * 0.3, size * 0.4, size * 0.3, size * 0.2);
        shape.quadraticCurveTo(size * 0.3, 0, size * 0.15, 0);
        shape.closePath();
        break;
        
      case 'C':
        // Arc shape
        shape.moveTo(size * 0.2, 0);
        shape.lineTo(-size * 0.1, 0);
        shape.quadraticCurveTo(-size * 0.3, 0, -size * 0.3, size * 0.4);
        shape.quadraticCurveTo(-size * 0.3, size * 0.8, -size * 0.1, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.6);
        shape.lineTo(-size * 0.05, size * 0.6);
        shape.quadraticCurveTo(-size * 0.15, size * 0.6, -size * 0.15, size * 0.4);
        shape.quadraticCurveTo(-size * 0.15, size * 0.2, -size * 0.05, size * 0.2);
        shape.lineTo(size * 0.1, size * 0.2);
        shape.closePath();
        break;
        
      case 'D':
        // Rectangle with curved right side
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.3, size * 0.8, size * 0.3, size * 0.4);
        shape.quadraticCurveTo(size * 0.3, 0, size * 0.1, 0);
        shape.closePath();
        break;
        
      case 'E':
        // Rectangle with horizontal lines
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.6);
        shape.lineTo(-size * 0.05, size * 0.6);
        shape.lineTo(-size * 0.05, size * 0.5);
        shape.lineTo(size * 0.15, size * 0.5);
        shape.lineTo(size * 0.15, size * 0.3);
        shape.lineTo(-size * 0.05, size * 0.3);
        shape.lineTo(-size * 0.05, size * 0.2);
        shape.lineTo(size * 0.2, size * 0.2);
        shape.lineTo(size * 0.2, 0);
        shape.closePath();
        break;
        
      case 'F':
        // Similar to E but no bottom line
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.6);
        shape.lineTo(-size * 0.05, size * 0.6);
        shape.lineTo(-size * 0.05, size * 0.5);
        shape.lineTo(size * 0.15, size * 0.5);
        shape.lineTo(size * 0.15, size * 0.3);
        shape.lineTo(-size * 0.05, size * 0.3);
        shape.lineTo(-size * 0.05, 0);
        shape.closePath();
        break;
        
      case 'G':
        // C with horizontal line
        shape.moveTo(size * 0.2, 0);
        shape.lineTo(-size * 0.1, 0);
        shape.quadraticCurveTo(-size * 0.3, 0, -size * 0.3, size * 0.4);
        shape.quadraticCurveTo(-size * 0.3, size * 0.8, -size * 0.1, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.6);
        shape.lineTo(size * 0.05, size * 0.6);
        shape.lineTo(size * 0.05, size * 0.4);
        shape.lineTo(size * 0.2, size * 0.4);
        shape.lineTo(size * 0.2, size * 0.2);
        shape.lineTo(-size * 0.05, size * 0.2);
        shape.quadraticCurveTo(-size * 0.15, size * 0.2, -size * 0.15, size * 0.4);
        shape.quadraticCurveTo(-size * 0.15, size * 0.6, -size * 0.05, size * 0.6);
        shape.lineTo(size * 0.1, size * 0.6);
        shape.closePath();
        break;
        
      case 'H':
        // Two vertical lines with crossbar
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.5);
        shape.lineTo(size * 0.05, size * 0.5);
        shape.lineTo(size * 0.05, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, 0);
        shape.lineTo(size * 0.05, 0);
        shape.lineTo(size * 0.05, size * 0.3);
        shape.lineTo(-size * 0.05, size * 0.3);
        shape.lineTo(-size * 0.05, 0);
        shape.closePath();
        break;
        
      case 'I':
        // Simple vertical line with serifs
        shape.moveTo(-size * 0.15, 0);
        shape.lineTo(size * 0.15, 0);
        shape.lineTo(size * 0.15, size * 0.15);
        shape.lineTo(size * 0.05, size * 0.15);
        shape.lineTo(size * 0.05, size * 0.65);
        shape.lineTo(size * 0.15, size * 0.65);
        shape.lineTo(size * 0.15, size * 0.8);
        shape.lineTo(-size * 0.15, size * 0.8);
        shape.lineTo(-size * 0.15, size * 0.65);
        shape.lineTo(-size * 0.05, size * 0.65);
        shape.lineTo(-size * 0.05, size * 0.15);
        shape.lineTo(-size * 0.15, size * 0.15);
        shape.closePath();
        break;
        
      case 'J':
        // Curved bottom
        shape.moveTo(-size * 0.1, size * 0.3);
        shape.quadraticCurveTo(-size * 0.1, 0, size * 0.1, 0);
        shape.quadraticCurveTo(size * 0.3, 0, size * 0.3, size * 0.3);
        shape.lineTo(size * 0.3, size * 0.8);
        shape.lineTo(size * 0.15, size * 0.8);
        shape.lineTo(size * 0.15, size * 0.3);
        shape.quadraticCurveTo(size * 0.15, size * 0.15, size * 0.05, size * 0.15);
        shape.quadraticCurveTo(-size * 0.05, size * 0.15, -size * 0.05, size * 0.3);
        shape.closePath();
        break;
        
      case 'K':
        // Vertical line with diagonal lines
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.5);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.8);
        shape.lineTo(size * 0.05, size * 0.45);
        shape.lineTo(size * 0.25, 0);
        shape.lineTo(size * 0.1, 0);
        shape.lineTo(-size * 0.05, size * 0.35);
        shape.lineTo(-size * 0.05, 0);
        shape.closePath();
        break;
        
      case 'L':
        // Vertical line with bottom horizontal
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.15);
        shape.lineTo(size * 0.2, size * 0.15);
        shape.lineTo(size * 0.2, 0);
        shape.closePath();
        break;
        
      case 'M':
        // Two vertical lines with connecting top
        shape.moveTo(-size * 0.25, 0);
        shape.lineTo(-size * 0.25, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.lineTo(0, size * 0.5);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.8);
        shape.lineTo(size * 0.25, 0);
        shape.lineTo(size * 0.1, 0);
        shape.lineTo(size * 0.1, size * 0.5);
        shape.lineTo(0, size * 0.3);
        shape.lineTo(-size * 0.1, size * 0.5);
        shape.lineTo(-size * 0.1, 0);
        shape.closePath();
        break;
        
      case 'N':
        // Two vertical lines with diagonal
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.3);
        shape.lineTo(size * 0.05, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, 0);
        shape.lineTo(size * 0.05, 0);
        shape.lineTo(size * 0.05, size * 0.5);
        shape.lineTo(-size * 0.05, 0);
        shape.closePath();
        break;
        
      case 'O':
        // Oval shape
        shape.moveTo(-size * 0.1, 0);
        shape.quadraticCurveTo(-size * 0.3, 0, -size * 0.3, size * 0.4);
        shape.quadraticCurveTo(-size * 0.3, size * 0.8, -size * 0.1, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.3, size * 0.8, size * 0.3, size * 0.4);
        shape.quadraticCurveTo(size * 0.3, 0, size * 0.1, 0);
        shape.closePath();
        
        // Create hole
        const hole = new THREE.Path();
        hole.moveTo(-size * 0.05, size * 0.2);
        hole.quadraticCurveTo(-size * 0.15, size * 0.2, -size * 0.15, size * 0.4);
        hole.quadraticCurveTo(-size * 0.15, size * 0.6, -size * 0.05, size * 0.6);
        hole.lineTo(size * 0.05, size * 0.6);
        hole.quadraticCurveTo(size * 0.15, size * 0.6, size * 0.15, size * 0.4);
        hole.quadraticCurveTo(size * 0.15, size * 0.2, size * 0.05, size * 0.2);
        hole.closePath();
        shape.holes.push(hole);
        break;
        
      case 'P':
        // Vertical line with top curve
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.3, size * 0.8, size * 0.3, size * 0.6);
        shape.quadraticCurveTo(size * 0.3, size * 0.4, size * 0.1, size * 0.4);
        shape.lineTo(-size * 0.05, size * 0.4);
        shape.lineTo(-size * 0.05, 0);
        shape.closePath();
        break;
        
      case 'Q':
        // O with tail
        shape.moveTo(-size * 0.1, 0);
        shape.quadraticCurveTo(-size * 0.3, 0, -size * 0.3, size * 0.4);
        shape.quadraticCurveTo(-size * 0.3, size * 0.8, -size * 0.1, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.3, size * 0.8, size * 0.3, size * 0.4);
        shape.quadraticCurveTo(size * 0.3, size * 0.1, size * 0.2, 0);
        shape.lineTo(size * 0.35, -size * 0.1);
        shape.lineTo(size * 0.25, -size * 0.2);
        shape.lineTo(size * 0.15, -size * 0.05);
        shape.quadraticCurveTo(size * 0.1, 0, -size * 0.1, 0);
        shape.closePath();
        
        // Create hole
        const qHole = new THREE.Path();
        qHole.moveTo(-size * 0.05, size * 0.2);
        qHole.quadraticCurveTo(-size * 0.15, size * 0.2, -size * 0.15, size * 0.4);
        qHole.quadraticCurveTo(-size * 0.15, size * 0.6, -size * 0.05, size * 0.6);
        qHole.lineTo(size * 0.05, size * 0.6);
        qHole.quadraticCurveTo(size * 0.15, size * 0.6, size * 0.15, size * 0.4);
        qHole.quadraticCurveTo(size * 0.15, size * 0.2, size * 0.05, size * 0.2);
        qHole.closePath();
        shape.holes.push(qHole);
        break;
        
      case 'R':
        // P with diagonal leg
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.3, size * 0.8, size * 0.3, size * 0.6);
        shape.quadraticCurveTo(size * 0.3, size * 0.4, size * 0.1, size * 0.4);
        shape.lineTo(size * 0.25, 0);
        shape.lineTo(size * 0.1, 0);
        shape.lineTo(-size * 0.02, size * 0.25);
        shape.lineTo(-size * 0.05, size * 0.25);
        shape.lineTo(-size * 0.05, 0);
        shape.closePath();
        break;
        
      case 'S':
        // Curved S shape
        shape.moveTo(size * 0.2, 0);
        shape.lineTo(-size * 0.05, 0);
        shape.quadraticCurveTo(-size * 0.25, 0, -size * 0.25, size * 0.2);
        shape.quadraticCurveTo(-size * 0.25, size * 0.35, -size * 0.1, size * 0.4);
        shape.lineTo(size * 0.1, size * 0.4);
        shape.quadraticCurveTo(size * 0.25, size * 0.45, size * 0.25, size * 0.6);
        shape.quadraticCurveTo(size * 0.25, size * 0.8, size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.2, size * 0.6);
        shape.lineTo(size * 0.0, size * 0.6);
        shape.quadraticCurveTo(size * 0.1, size * 0.6, size * 0.1, size * 0.55);
        shape.quadraticCurveTo(size * 0.1, size * 0.5, size * 0.0, size * 0.5);
        shape.lineTo(-size * 0.1, size * 0.5);
        shape.quadraticCurveTo(-size * 0.2, size * 0.45, -size * 0.2, size * 0.3);
        shape.quadraticCurveTo(-size * 0.2, size * 0.15, -size * 0.05, size * 0.15);
        shape.lineTo(size * 0.2, size * 0.15);
        shape.closePath();
        break;
        
      case 'T':
        // Horizontal top with vertical center
        shape.moveTo(-size * 0.25, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.65);
        shape.lineTo(size * 0.075, size * 0.65);
        shape.lineTo(size * 0.075, 0);
        shape.lineTo(-size * 0.075, 0);
        shape.lineTo(-size * 0.075, size * 0.65);
        shape.lineTo(-size * 0.25, size * 0.65);
        shape.closePath();
        break;
        
      case 'U':
        // Curved bottom
        shape.moveTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.05, size * 0.25);
        shape.quadraticCurveTo(-size * 0.05, size * 0.1, 0, size * 0.1);
        shape.quadraticCurveTo(size * 0.05, size * 0.1, size * 0.05, size * 0.25);
        shape.lineTo(size * 0.05, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.25);
        shape.quadraticCurveTo(size * 0.2, 0, 0, 0);
        shape.quadraticCurveTo(-size * 0.2, 0, -size * 0.2, size * 0.25);
        shape.closePath();
        break;
        
      case 'V':
        // Two diagonal lines meeting at bottom
        shape.moveTo(-size * 0.25, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.lineTo(0, size * 0.1);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.8);
        shape.lineTo(size * 0.075, 0);
        shape.lineTo(-size * 0.075, 0);
        shape.closePath();
        break;
        
      case 'W':
        // Double V
        shape.moveTo(-size * 0.3, size * 0.8);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.2);
        shape.lineTo(0, size * 0.6);
        shape.lineTo(size * 0.1, size * 0.2);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.3, size * 0.8);
        shape.lineTo(size * 0.15, 0);
        shape.lineTo(size * 0.05, 0);
        shape.lineTo(0, size * 0.4);
        shape.lineTo(-size * 0.05, 0);
        shape.lineTo(-size * 0.15, 0);
        shape.closePath();
        break;
        
      case 'X':
        // Two diagonal lines crossing
        shape.moveTo(-size * 0.25, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.lineTo(0, size * 0.5);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.8);
        shape.lineTo(size * 0.075, size * 0.45);
        shape.lineTo(size * 0.25, 0);
        shape.lineTo(size * 0.1, 0);
        shape.lineTo(0, size * 0.35);
        shape.lineTo(-size * 0.1, 0);
        shape.lineTo(-size * 0.25, 0);
        shape.lineTo(-size * 0.075, size * 0.45);
        shape.closePath();
        break;
        
      case 'Y':
        // Two diagonals meeting with vertical
        shape.moveTo(-size * 0.25, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.lineTo(0, size * 0.5);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.lineTo(size * 0.25, size * 0.8);
        shape.lineTo(size * 0.075, size * 0.45);
        shape.lineTo(size * 0.075, 0);
        shape.lineTo(-size * 0.075, 0);
        shape.lineTo(-size * 0.075, size * 0.45);
        shape.closePath();
        break;
        
      case 'Z':
        // Horizontal lines with diagonal
        shape.moveTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.65);
        shape.lineTo(-size * 0.05, size * 0.15);
        shape.lineTo(size * 0.2, size * 0.15);
        shape.lineTo(size * 0.2, 0);
        shape.lineTo(-size * 0.2, 0);
        shape.lineTo(-size * 0.2, size * 0.15);
        shape.lineTo(size * 0.05, size * 0.65);
        shape.lineTo(-size * 0.2, size * 0.65);
        shape.closePath();
        break;
        
      case '0':
        // Oval with diagonal line
        shape.moveTo(-size * 0.1, 0);
        shape.quadraticCurveTo(-size * 0.25, 0, -size * 0.25, size * 0.4);
        shape.quadraticCurveTo(-size * 0.25, size * 0.8, -size * 0.1, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.25, size * 0.8, size * 0.25, size * 0.4);
        shape.quadraticCurveTo(size * 0.25, 0, size * 0.1, 0);
        shape.closePath();
        
        // Create hole
        const zeroHole = new THREE.Path();
        zeroHole.moveTo(-size * 0.05, size * 0.15);
        zeroHole.quadraticCurveTo(-size * 0.12, size * 0.15, -size * 0.12, size * 0.4);
        zeroHole.quadraticCurveTo(-size * 0.12, size * 0.65, -size * 0.05, size * 0.65);
        zeroHole.lineTo(size * 0.05, size * 0.65);
        zeroHole.quadraticCurveTo(size * 0.12, size * 0.65, size * 0.12, size * 0.4);
        zeroHole.quadraticCurveTo(size * 0.12, size * 0.15, size * 0.05, size * 0.15);
        zeroHole.closePath();
        shape.holes.push(zeroHole);
        break;
        
      case '1':
        // Simple vertical line with top serif
        shape.moveTo(-size * 0.1, size * 0.6);
        shape.lineTo(0, size * 0.8);
        shape.lineTo(size * 0.075, size * 0.8);
        shape.lineTo(size * 0.075, 0);
        shape.lineTo(-size * 0.075, 0);
        shape.lineTo(-size * 0.075, size * 0.65);
        shape.closePath();
        break;
        
      case '2':
        // Curved top with angled bottom
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(size * 0.2, 0);
        shape.lineTo(size * 0.2, size * 0.15);
        shape.lineTo(-size * 0.05, size * 0.4);
        shape.quadraticCurveTo(size * 0.1, size * 0.5, size * 0.1, size * 0.65);
        shape.quadraticCurveTo(size * 0.1, size * 0.8, -size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.15, size * 0.8);
        shape.quadraticCurveTo(-size * 0.25, size * 0.8, -size * 0.25, size * 0.65);
        shape.lineTo(-size * 0.1, size * 0.65);
        shape.quadraticCurveTo(-size * 0.1, size * 0.7, -size * 0.05, size * 0.7);
        shape.quadraticCurveTo(0, size * 0.7, 0, size * 0.65);
        shape.quadraticCurveTo(0, size * 0.55, -size * 0.1, size * 0.45);
        shape.lineTo(-size * 0.2, size * 0.15);
        shape.closePath();
        break;
        
      case '3':
        // Two curves
        shape.moveTo(-size * 0.15, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.25, size * 0.8, size * 0.25, size * 0.65);
        shape.quadraticCurveTo(size * 0.25, size * 0.5, size * 0.1, size * 0.45);
        shape.quadraticCurveTo(size * 0.25, size * 0.4, size * 0.25, size * 0.25);
        shape.quadraticCurveTo(size * 0.25, 0, size * 0.1, 0);
        shape.lineTo(-size * 0.15, 0);
        shape.lineTo(-size * 0.15, size * 0.15);
        shape.lineTo(size * 0.05, size * 0.15);
        shape.quadraticCurveTo(size * 0.1, size * 0.15, size * 0.1, size * 0.25);
        shape.quadraticCurveTo(size * 0.1, size * 0.35, size * 0.05, size * 0.35);
        shape.lineTo(0, size * 0.35);
        shape.lineTo(0, size * 0.45);
        shape.lineTo(size * 0.05, size * 0.45);
        shape.quadraticCurveTo(size * 0.1, size * 0.45, size * 0.1, size * 0.55);
        shape.quadraticCurveTo(size * 0.1, size * 0.65, size * 0.05, size * 0.65);
        shape.lineTo(-size * 0.15, size * 0.65);
        shape.closePath();
        break;
        
      case '4':
        // Vertical and horizontal lines
        shape.moveTo(size * 0.05, 0);
        shape.lineTo(size * 0.05, size * 0.3);
        shape.lineTo(size * 0.2, size * 0.3);
        shape.lineTo(size * 0.2, size * 0.45);
        shape.lineTo(size * 0.05, size * 0.45);
        shape.lineTo(size * 0.05, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.45);
        shape.lineTo(-size * 0.2, size * 0.45);
        shape.lineTo(-size * 0.2, size * 0.3);
        shape.lineTo(-size * 0.1, size * 0.3);
        shape.lineTo(-size * 0.1, 0);
        shape.closePath();
        break;
        
      case '5':
        // Horizontal lines with curve
        shape.moveTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.65);
        shape.lineTo(-size * 0.05, size * 0.65);
        shape.lineTo(-size * 0.05, size * 0.5);
        shape.lineTo(size * 0.1, size * 0.5);
        shape.quadraticCurveTo(size * 0.25, size * 0.5, size * 0.25, size * 0.25);
        shape.quadraticCurveTo(size * 0.25, 0, size * 0.1, 0);
        shape.lineTo(-size * 0.15, 0);
        shape.lineTo(-size * 0.15, size * 0.15);
        shape.lineTo(size * 0.05, size * 0.15);
        shape.quadraticCurveTo(size * 0.1, size * 0.15, size * 0.1, size * 0.25);
        shape.quadraticCurveTo(size * 0.1, size * 0.35, size * 0.05, size * 0.35);
        shape.lineTo(-size * 0.2, size * 0.35);
        shape.closePath();
        break;
        
      case '6':
        // Circle with top opening
        shape.moveTo(size * 0.1, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.quadraticCurveTo(-size * 0.25, size * 0.8, -size * 0.25, size * 0.4);
        shape.quadraticCurveTo(-size * 0.25, 0, -size * 0.1, 0);
        shape.lineTo(size * 0.1, 0);
        shape.quadraticCurveTo(size * 0.25, 0, size * 0.25, size * 0.2);
        shape.quadraticCurveTo(size * 0.25, size * 0.4, size * 0.1, size * 0.4);
        shape.lineTo(-size * 0.1, size * 0.4);
        shape.quadraticCurveTo(-size * 0.1, size * 0.65, size * 0.05, size * 0.65);
        shape.closePath();
        
        // Create hole for bottom circle
        const sixHole = new THREE.Path();
        sixHole.moveTo(-size * 0.05, size * 0.15);
        sixHole.quadraticCurveTo(-size * 0.1, size * 0.15, -size * 0.1, size * 0.2);
        sixHole.quadraticCurveTo(-size * 0.1, size * 0.25, -size * 0.05, size * 0.25);
        sixHole.lineTo(size * 0.05, size * 0.25);
        sixHole.quadraticCurveTo(size * 0.1, size * 0.25, size * 0.1, size * 0.2);
        sixHole.quadraticCurveTo(size * 0.1, size * 0.15, size * 0.05, size * 0.15);
        sixHole.closePath();
        shape.holes.push(sixHole);
        break;
        
      case '7':
        // Horizontal top with diagonal
        shape.moveTo(-size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(size * 0.2, size * 0.65);
        shape.lineTo(size * 0.05, size * 0.65);
        shape.lineTo(-size * 0.1, 0);
        shape.lineTo(-size * 0.25, 0);
        shape.lineTo(-size * 0.05, size * 0.65);
        shape.lineTo(-size * 0.2, size * 0.65);
        shape.closePath();
        break;
        
      case '8':
        // Two circles stacked
        shape.moveTo(-size * 0.1, 0);
        shape.quadraticCurveTo(-size * 0.25, 0, -size * 0.25, size * 0.2);
        shape.quadraticCurveTo(-size * 0.25, size * 0.35, -size * 0.15, size * 0.4);
        shape.quadraticCurveTo(-size * 0.25, size * 0.45, -size * 0.25, size * 0.6);
        shape.quadraticCurveTo(-size * 0.25, size * 0.8, -size * 0.1, size * 0.8);
        shape.lineTo(size * 0.1, size * 0.8);
        shape.quadraticCurveTo(size * 0.25, size * 0.8, size * 0.25, size * 0.6);
        shape.quadraticCurveTo(size * 0.25, size * 0.45, size * 0.15, size * 0.4);
        shape.quadraticCurveTo(size * 0.25, size * 0.35, size * 0.25, size * 0.2);
        shape.quadraticCurveTo(size * 0.25, 0, size * 0.1, 0);
        shape.closePath();
        
        // Top hole
        const eightTopHole = new THREE.Path();
        eightTopHole.moveTo(-size * 0.05, size * 0.5);
        eightTopHole.quadraticCurveTo(-size * 0.1, size * 0.5, -size * 0.1, size * 0.6);
        eightTopHole.quadraticCurveTo(-size * 0.1, size * 0.7, -size * 0.05, size * 0.7);
        eightTopHole.lineTo(size * 0.05, size * 0.7);
        eightTopHole.quadraticCurveTo(size * 0.1, size * 0.7, size * 0.1, size * 0.6);
        eightTopHole.quadraticCurveTo(size * 0.1, size * 0.5, size * 0.05, size * 0.5);
        eightTopHole.closePath();
        shape.holes.push(eightTopHole);
        
        // Bottom hole
        const eightBottomHole = new THREE.Path();
        eightBottomHole.moveTo(-size * 0.05, size * 0.1);
        eightBottomHole.quadraticCurveTo(-size * 0.1, size * 0.1, -size * 0.1, size * 0.2);
        eightBottomHole.quadraticCurveTo(-size * 0.1, size * 0.3, -size * 0.05, size * 0.3);
        eightBottomHole.lineTo(size * 0.05, size * 0.3);
        eightBottomHole.quadraticCurveTo(size * 0.1, size * 0.3, size * 0.1, size * 0.2);
        eightBottomHole.quadraticCurveTo(size * 0.1, size * 0.1, size * 0.05, size * 0.1);
        eightBottomHole.closePath();
        shape.holes.push(eightBottomHole);
        break;
        
      case '9':
        // 6 upside down
        shape.moveTo(-size * 0.1, 0);
        shape.lineTo(size * 0.1, 0);
        shape.quadraticCurveTo(size * 0.25, 0, size * 0.25, size * 0.4);
        shape.quadraticCurveTo(size * 0.25, size * 0.8, size * 0.1, size * 0.8);
        shape.lineTo(-size * 0.1, size * 0.8);
        shape.quadraticCurveTo(-size * 0.25, size * 0.8, -size * 0.25, size * 0.6);
        shape.quadraticCurveTo(-size * 0.25, size * 0.4, -size * 0.1, size * 0.4);
        shape.lineTo(size * 0.1, size * 0.4);
        shape.quadraticCurveTo(size * 0.1, size * 0.15, -size * 0.05, size * 0.15);
        shape.closePath();
        
        // Create hole for top circle
        const nineHole = new THREE.Path();
        nineHole.moveTo(size * 0.05, size * 0.55);
        nineHole.quadraticCurveTo(size * 0.1, size * 0.55, size * 0.1, size * 0.6);
        nineHole.quadraticCurveTo(size * 0.1, size * 0.65, size * 0.05, size * 0.65);
        nineHole.lineTo(-size * 0.05, size * 0.65);
        nineHole.quadraticCurveTo(-size * 0.1, size * 0.65, -size * 0.1, size * 0.6);
        nineHole.quadraticCurveTo(-size * 0.1, size * 0.55, -size * 0.05, size * 0.55);
        nineHole.closePath();
        shape.holes.push(nineHole);
        break;
        
      default:
        // Default rectangle for unsupported characters
        shape.moveTo(-size * 0.2, 0);
        shape.lineTo(size * 0.2, 0);
        shape.lineTo(size * 0.2, size * 0.8);
        shape.lineTo(-size * 0.2, size * 0.8);
        shape.closePath();
        break;
    }

    // Create extrude geometry
    const extrudeSettings = {
      depth: options.height,
      bevelEnabled: options.bevelEnabled,
      bevelThickness: options.bevelThickness,
      bevelSize: options.bevelSize,
      bevelSegments: options.bevelSegments
    };

    try {
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    } catch (error) {
      console.warn(`Failed to create geometry for character '${char}':`, error);
      // Return a simple box as fallback
      return new THREE.BoxGeometry(size * 0.4, size * 0.8, options.height);
    }
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

  const handleCreateText = () => {
    try {
      // Validate input
      if (!textInputData.text.trim()) {
        console.warn('Text input is empty');
        return;
      }

      // Create the 3D text geometry using the simplified approach
      const textGroup = create3DTextGeometry(textInputData);
      
      // Create the text object definition
      const textObjectDef = {
        name: `Text: ${textInputData.text}`,
        geometry: () => textGroup,
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