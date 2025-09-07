export enum FeatureRequestStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export const FEATURE_REQUEST_STATUS_LABELS: Record<FeatureRequestStatus, string> = {
  [FeatureRequestStatus.SUBMITTED]: 'New',
  [FeatureRequestStatus.UNDER_REVIEW]: 'Under Review',
  [FeatureRequestStatus.IN_PROGRESS]: 'In Progress',
  [FeatureRequestStatus.COMPLETED]: 'Completed',
  [FeatureRequestStatus.REJECTED]: 'Rejected',
};

export const FEATURE_REQUEST_STATUS_COLORS: Record<FeatureRequestStatus, { bg: string; text: string }> = {
  [FeatureRequestStatus.SUBMITTED]: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  [FeatureRequestStatus.UNDER_REVIEW]: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
  },
  [FeatureRequestStatus.IN_PROGRESS]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  [FeatureRequestStatus.COMPLETED]: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
  },
  [FeatureRequestStatus.REJECTED]: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
  },
};