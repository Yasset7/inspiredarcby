import { Phase } from '@/types/certification';

export const phases: Phase[] = [
  {
    id: 1,
    name: "Fondamentaux",
    startDate: "2025-09-13",
    endDate: "2025-09-30",
    description: "Machine Learning, AWS Architect et Terraform",
    color: 'gradient-ml',
    tasks: [
      { name: "Machine Learning", hours: 2, type: 'ml' },
      { name: "AWS Architect", hours: 2, type: 'aws' },
      { name: "Terraform", hours: 1, type: 'terraform' },
      { name: "Révisions/Exercices", hours: 1, type: 'revision' }
    ]
  },
  {
    id: 2,
    name: "Spécialisation AWS ML",
    startDate: "2025-10-01",
    endDate: "2025-10-25",
    description: "AWS ML Specialty et ML Engineer",
    color: 'gradient-aws',
    tasks: [
      { name: "AWS ML Specialty", hours: 3, type: 'aws' },
      { name: "AWS ML Engineer", hours: 2, type: 'aws' },
      { name: "Labo/Pratique", hours: 1, type: 'lab' }
    ]
  },
  {
    id: 3,
    name: "Approfondissement",
    startDate: "2025-10-26",
    endDate: "2025-11-15",
    description: "Stanford ML/AI et révisions complètes",
    color: 'gradient-terraform',
    tasks: [
      { name: "Fiches Stanford ML/AI", hours: 2, type: 'ml' },
      { name: "Révisions/Mocks AWS", hours: 2, type: 'revision' },
      { name: "Révisions ML", hours: 1, type: 'revision' },
      { name: "Terraform", hours: 1, type: 'terraform' }
    ]
  }
];

export const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'ml': return '🧠';
    case 'aws': return '☁️';
    case 'terraform': return '🏗️';
    case 'revision': return '📚';
    case 'lab': return '🔬';
    default: return '📖';
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'ml': return 'ml-cert';
    case 'aws': return 'aws-cert';
    case 'terraform': return 'terraform-cert';
    case 'revision': return 'primary';
    case 'lab': return 'secondary';
    default: return 'muted';
  }
};