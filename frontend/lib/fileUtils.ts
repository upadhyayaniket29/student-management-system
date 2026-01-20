// Utility function to get the full URL for uploaded files
export const getFileUrl = (filePath: string): string => {
    if (!filePath) return '';

    // If it's already a full URL, return it
    if (filePath.startsWith('http')) return filePath;

    // Use the API base URL (without /api) for file uploads
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${filePath}`;
};
