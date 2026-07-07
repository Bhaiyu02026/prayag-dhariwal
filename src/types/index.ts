export interface Project {
  id: number | string; // Supporting both auto-incrementing numbers and static placeholder string IDs
  title: string;
  category: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Future Concept';
  tech_stack: string[];
  file_url: string;
  version: string;
  icon_url?: string;
  screenshots?: string[];
  is_restricted: boolean; // 💻 CRITICAL NEW LINE: Injects the missing schema type parameter
}

export interface RoadmapMilestone {
  id: number;
  step: string;
  title: string;
  location: string;
  description: string;
  status: 'current' | 'upcoming' | 'future';
  sequence_order: number;
}
