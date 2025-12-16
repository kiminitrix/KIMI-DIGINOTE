import { FileData } from '../types';

export const readFileAsBase64 = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = result.split(',')[1];
      resolve({
        name: file.name,
        type: file.type,
        data: base64Data,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const isValidFileType = (file: File): boolean => {
  const validTypes = [
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json'
  ];
  return validTypes.includes(file.type);
};
