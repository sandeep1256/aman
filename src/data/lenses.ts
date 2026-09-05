import { LensOption } from '../types';

export const LENS_OPTIONS: LensOption[] = [
  {
    id: 'lens-zero-bluecut',
    name: 'Zero Power Blue-Shield 420™',
    category: 'zero_power',
    index: '1.56 Standard',
    price: 990,
    description: '100% UV420 protection & blue light filter designed for programmers, gamers, and office professionals.',
    coatings: ['Anti-Reflective', 'Blue-Block 420nm', 'Scratch Resistant', 'Smudge Proof'],
    warrantyYears: 1,
    idealFor: 'No eye power needed, excessive phone & laptop screen use'
  },
  {
    id: 'lens-sv-crizal-thin',
    name: 'Single Vision HD Thin 1.60',
    category: 'single_vision',
    index: '1.60 Thin',
    price: 1890,
    description: 'Digital aspheric single vision lens, 25% thinner and lighter with crystal clear clarity.',
    coatings: ['Anti-Glare Crizal-Tech', 'Hydrophobic & Oleophobic', 'UV400 Shield', 'Hard Coat Anti-Scratch'],
    warrantyYears: 1,
    idealFor: 'Everyday distance or reading for powers between -3.00 to +3.00'
  },
  {
    id: 'lens-sv-ultra-167',
    name: 'Single Vision Ultra-Thin 1.67 Aspheric',
    category: 'single_vision',
    index: '1.67 Ultra-Thin',
    price: 3290,
    description: '45% flatter and thinner with edge-thinning technology for moderate to high powers.',
    coatings: ['Super Hydrophobic Dust-Repel', 'Anti-Static', 'Double Anti-Reflective', 'Diamond Hard Coat'],
    warrantyYears: 2,
    idealFor: 'High power prescriptions (-3.25 to -7.00) without bulky edges'
  },
  {
    id: 'lens-progressive-pro',
    name: 'Digital Freeform Progressive 1.60 (No-Line)',
    category: 'progressive_bifocal',
    index: '1.60 Thin',
    price: 4490,
    description: 'Seamless wide-corridor progressive lenses providing crisp vision for Distance, Computer (Mid), and Reading.',
    coatings: ['Digital Surface Polishing', 'Blue-Guard', 'Anti-Reflective', 'UV Block'],
    warrantyYears: 2,
    idealFor: 'Presbyopia / Age 40+ needing one pair for reading, laptop, and driving'
  },
  {
    id: 'lens-photochromic-trans',
    name: 'Smart Transitions® Photochromic 1.60',
    category: 'photochromic',
    index: '1.60 Thin',
    price: 3790,
    description: 'Clears indoors and automatically darkens to deep sunglasses tint in outdoor sunlight within 20 seconds.',
    coatings: ['Fast-Activation Matrix', 'UV400 Block', 'Anti-Glare Night Driving', 'Water-Repel'],
    warrantyYears: 1,
    idealFor: 'All-in-one day & night spectacles that double as sunglasses'
  },
  {
    id: 'lens-sun-polarized-hd',
    name: 'Aman Polarized Sun HD 1.56',
    category: 'polarized_sun',
    index: '1.56 Standard',
    price: 2190,
    description: 'High-contrast polarized tint eliminating intense road and water surface glare for driving and travel.',
    coatings: ['99.9% Glare Polarizer', 'UV400 Protection', 'Mirror Flash Coating (Optional)', 'Hard Coat'],
    warrantyYears: 1,
    idealFor: 'Driving, fishing, beaches, high-sun conditions'
  }
];
