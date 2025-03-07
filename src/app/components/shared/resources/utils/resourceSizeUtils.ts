import { Resource } from "../ResourceItem";

// Maximum resource size limit (3MB)
export const MAX_RESOURCE_SIZE_BYTES = 2.02 * 1024 * 1024;

/**
 * Calculate the total size of all resources
 */
export const calculateTotalResourceSize = (resources: Resource[]): number => {
  return resources.reduce((total, resource) => {
    // For resources with explicit fileSize
    if (resource.fileSize !== undefined) {
      return total + resource.fileSize;
    }

    // For text and code resources with content
    if (
      (resource.type === "text" || resource.type === "code") &&
      resource.content
    ) {
      return total + new TextEncoder().encode(resource.content).length;
    }

    // Estimate sizes for other resource types
    switch (resource.type) {
      case "image":
        return total + 2 * 1024 * 1024; // Estimate 2MB for images
      case "link":
        return total + 100; // Estimate 100 bytes for links
      case "directory":
        return total; // Directories themselves don't count
      default:
        return total + 1024; // Default estimate: 1KB
    }
  }, 0);
};

/**
 * Check if adding a resource would exceed the limit
 */
export const wouldExceedLimit = (
  resources: Resource[],
  newResourceSize: number
): boolean => {
  const currentSize = calculateTotalResourceSize(resources);
  return currentSize + newResourceSize > MAX_RESOURCE_SIZE_BYTES;
};

/**
 * Format bytes to human-readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
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
