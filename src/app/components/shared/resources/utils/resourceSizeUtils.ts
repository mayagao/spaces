import { Resource } from "../ResourceItem";

// Maximum resource size limit (3MB)
export const MAX_RESOURCE_SIZE_BYTES = 3 * 1024 * 1024;

/**
 * Calculate the total size of all resources
 */
export const calculateTotalResourceSize = (resources: Resource[]): number => {
  return resources.reduce((total, resource) => {
    return total + (resource.fileSize || 0);
  }, 0);
};

/**
 * Check if adding a resource would exceed the limit
 */
export const wouldExceedLimit = (
  resources: Resource[],
  additionalBytes: number
): boolean => {
  const currentSize = calculateTotalResourceSize(resources);
  return currentSize + additionalBytes > MAX_RESOURCE_SIZE_BYTES;
};

/**
 * Format bytes to human-readable format
 */
export const formatFileSize = (bytes: number, totalSize: number): string => {
  // Show as percentage if total size is provided
  if (totalSize > 0) {
    const percentage = (bytes / totalSize) * 100;
    return `${percentage < 1 ? "<1" : Math.round(percentage)}%`;
  }

  // Otherwise show in bytes/KB/MB
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/**
 * Format bytes as a percentage of the total resource limit
 */
export const formatBytesAsPercentage = (bytes: number): string => {
  const percentage = (bytes / MAX_RESOURCE_SIZE_BYTES) * 100;
  return percentage < 0.1 ? "<0.1%" : `${percentage.toFixed(1)}%`;
};

/**
 * Calculate the percentage of the total resource limit used by all resources
 */
export const calculateTotalPercentage = (resources: Resource[]): number => {
  const totalSize = calculateTotalResourceSize(resources);
  return (totalSize / MAX_RESOURCE_SIZE_BYTES) * 100;
};
