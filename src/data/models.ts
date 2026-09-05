import { FaceShape } from '../types';

export interface ModelFace {
  id: string;
  name: string;
  gender: 'women' | 'men';
  faceShape: FaceShape;
  photoUrl: string;
  glassesOffset: {
    top: number; // percentage from top
    left: number; // percentage from left
    scale: number;
    rotation: number;
  };
}

export const MODEL_FACES: ModelFace[] = [
  {
    id: 'model-1',
    name: 'Aanya (Oval Face)',
    gender: 'women',
    faceShape: 'Oval',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    glassesOffset: { top: 41.5, left: 50, scale: 1.05, rotation: 0 }
  },
  {
    id: 'model-2',
    name: 'Kabir (Square Jawline)',
    gender: 'men',
    faceShape: 'Square',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    glassesOffset: { top: 38.5, left: 50, scale: 1.08, rotation: 0 }
  },
  {
    id: 'model-3',
    name: 'Elena (Heart Shape)',
    gender: 'women',
    faceShape: 'Heart',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    glassesOffset: { top: 39.5, left: 50, scale: 1.02, rotation: 1 }
  },
  {
    id: 'model-4',
    name: 'Dev (Round Face)',
    gender: 'men',
    faceShape: 'Round',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    glassesOffset: { top: 39.0, left: 50, scale: 1.06, rotation: -1 }
  },
  {
    id: 'model-5',
    name: 'Zoya (Diamond Contours)',
    gender: 'women',
    faceShape: 'Diamond',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    glassesOffset: { top: 40.0, left: 50, scale: 1.04, rotation: 0 }
  },
  {
    id: 'model-6',
    name: 'Marcus (Oblong / Tall)',
    gender: 'men',
    faceShape: 'Oblong',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
    glassesOffset: { top: 37.5, left: 50, scale: 1.05, rotation: 0 }
  }
];
