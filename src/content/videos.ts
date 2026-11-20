import type { DomainId } from './domains';

/**
 * Real video clips for the "Technology domains" explorer, one per domain.
 * Files live in /public/videos/ (H.264, 1280 px wide, no sound, max 12 s, ~0.2–1.3 MB each)
 * with a poster image (.jpg) that shows while the clip loads.
 *
 * All clips are from Pexels (free for commercial use, no attribution required; credited here
 * anyway). They show equipment only, never people presented as our students.
 * To swap a clip for your own footage: replace the .mp4 and .jpg and update `credit`.
 */
export type DomainVideo = { src: string; poster: string; alt: string; credit: string; source: string };

export const domainVideos: Record<DomainId, DomainVideo> = {
  ai: {
    src: '/videos/domain-ai.mp4', poster: '/videos/domain-ai.jpg',
    alt: 'A small white humanoid robot moving its arms on a dark stage',
    credit: 'Pavel Danilyuk / Pexels', source: 'https://www.pexels.com/video/8084489/',
  },
  robotics: {
    src: '/videos/domain-robotics.mp4', poster: '/videos/domain-robotics.jpg',
    alt: 'A robotic arm moving chess pieces on a chessboard',
    credit: 'Pavel Danilyuk / Pexels', source: 'https://www.pexels.com/video/8327795/',
  },
  iot: {
    src: '/videos/domain-iot.mp4', poster: '/videos/domain-iot.jpg',
    alt: 'The camera moves slowly across the chips and pins of an Arduino board',
    credit: 'StefWithAnF / Pexels', source: 'https://www.pexels.com/video/6208729/',
  },
  drones: {
    src: '/videos/domain-drones.mp4', poster: '/videos/domain-drones.jpg',
    alt: 'A small quadcopter drone hovering against a blue sky with clouds',
    credit: 'Efrem Efre / Pexels', source: 'https://www.pexels.com/video/36782114/',
  },
  coding: {
    src: '/videos/domain-coding.mp4', poster: '/videos/domain-coding.jpg',
    alt: 'Code scrolling in a dark-mode editor and terminal on a computer screen',
    credit: 'cottonbro studio / Pexels', source: 'https://www.pexels.com/video/6804121/',
  },
  fabrication: {
    src: '/videos/domain-fabrication.mp4', poster: '/videos/domain-fabrication.jpg',
    alt: 'A 3D printer laying down orange plastic, then the printers in a workshop',
    credit: 'Jakub Zerdzicki / Pexels', source: 'https://www.pexels.com/video/31076271/',
  },
};
