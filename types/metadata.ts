// types/metadata.ts

export const categoryOptions: string[] = [
  'Medical',
  'Environmental',
  'Educational',
  'Biological',
  'Technical',
  'Other',
];

export const imageQualityOptions: string[] = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
];

export const annotationFormFields = [
  { id: 'title', label: 'Title', type: 'text', placeholder: '' },
  { id: 'tags', label: 'Tags', type: 'text', placeholder: 'Comma-separated' },
  { id: 'annotatedBy', label: 'Annotated By', type: 'text', placeholder: '' },
];