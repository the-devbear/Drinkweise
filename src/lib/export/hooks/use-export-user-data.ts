import { exportUserDataToJSON } from '@drinkweise/lib/export/export-user-data';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useCallback, useRef, useState } from 'react';

interface UseExportUserDataReturn {
  exportData: () => Promise<void>;
  cancelExport: () => void;
  isExporting: boolean;
  error: string | null;
}

export function useExportUserData(): UseExportUserDataReturn {
  const userId = useAppSelector(userIdSelector);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelExport = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsExporting(false);
      setError('Export was cancelled.');
    }
  }, []);

  const exportData = useCallback(async () => {
    if (!userId) {
      setError('Unable to export data. Please try signing in again.');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsExporting(true);
    setError(null);

    try {
      const result = await exportUserDataToJSON({ userId, signal });

      if (signal.aborted) {
        return;
      }

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      if (signal.aborted) {
        return;
      }

      console.error('Error exporting data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while exporting your data.'
      );
    } finally {
      if (!signal.aborted) {
        setIsExporting(false);
        abortControllerRef.current = null;
      }
    }
  }, [userId]);

  return {
    exportData,
    cancelExport,
    isExporting,
    error,
  };
}
