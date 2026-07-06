export interface Project {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Future Concept';
  category: string;
  tech_stack: string[];
  file_url?: string;   // The link to download your compiled .exe or .apk
  source_url?: string; // Optional GitHub or source code link
}
