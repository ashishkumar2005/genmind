/**
 * Learning domains shown on the home page. Edit to match exactly what GenmindEdtech teaches;
 * remove any domain you do not offer. Example projects must be things students
 * actually build in your programmes.
 */
export type DomainId = 'ai' | 'robotics' | 'iot' | 'drones' | 'coding' | 'fabrication';

export const domains: { id: DomainId; name: string; label: string; summary: string; projects: string[]; ages: string }[] = [
  {
    id: 'ai',
    label: 'Core intelligence',
    name: 'Artificial intelligence',
    summary: 'Students train simple models on data they collect themselves, then see where those models get things right and wrong.',
    projects: ['An image classifier that sorts recyclable waste', 'A gesture-controlled game', 'A chatbot that answers questions about the school'],
    ages: 'Class 6 upwards',
  },
  {
    id: 'robotics',
    label: 'Machines that move',
    name: 'Robotics',
    summary: 'Motors, sensors and microcontrollers come together in machines that move, sense and react.',
    projects: ['A line-following robot', 'A switch-controlled race car', 'A robotic arm that picks and places objects'],
    ages: 'Class 3 upwards',
  },
  {
    id: 'iot',
    label: 'Connected devices',
    name: 'Electronics & IoT',
    summary: 'From a first blinking LED to devices that send sensor readings to a phone over Wi-Fi.',
    projects: ['A smart plant-watering system', 'A classroom air-quality monitor', 'A motion-triggered security alarm'],
    ages: 'Class 5 upwards',
  },
  {
    id: 'drones',
    label: 'Flight systems',
    name: 'Drones',
    summary: 'How drones fly, how they are controlled and how to operate them safely and within the rules.',
    projects: ['Assembling and calibrating a training drone', 'Indoor obstacle courses', 'Planning a mapping flight'],
    ages: 'Class 8 upwards',
  },
  {
    id: 'coding',
    label: 'Software foundations',
    name: 'Coding',
    summary: 'Block-based coding for younger learners and Python for older ones, always tied to a project that does something.',
    projects: ['Games in Scratch', 'Data analysis in Python', 'Programs that control the robots they build'],
    ages: 'Class 1 upwards',
  },
  {
    id: 'fabrication',
    label: 'Rapid fabrication',
    name: '3D design & printing',
    summary: 'Students design parts on a computer and print them, from keychains to custom mounts for their robots.',
    projects: ['Name tags and simple models', 'Replacement parts for lab kits', 'Enclosures for electronics projects'],
    ages: 'Class 4 upwards',
  },
];
