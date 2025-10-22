import { supabase } from '@drinkweise/lib/supabase';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import { documentDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import z from 'zod';

import {
  exportedNotificationPreferencesSchema,
  ExportedUserDataV1,
} from './schema/export-data.schema.v1';
import { calculateGramsOfAlcohol } from '../utils/calculations/calculate-grams-of-alcohol';

interface ExportUserDataOptions {
  userId: string;
  supabaseClient?: TypedSupabaseClient;
  signal?: AbortSignal;
}

export async function exportUserDataToJSON({
  userId,
  supabaseClient = supabase,
  signal,
}: ExportUserDataOptions): Promise<
  { success: true; message: string } | { success: false; message: string }
> {
  try {
    if (signal?.aborted) {
      return {
        success: false,
        message: 'Export was cancelled.',
      };
    }

    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('id, username, height, weight, gender, created_at, notification_preferences')
      .eq('id', userId)
      .abortSignal(signal ?? new AbortController().signal)
      .single();

    if (userError || !userData) {
      return {
        success: false,
        message: 'Failed to fetch user profile data.',
      };
    }

    const { data: sessionsData, error: sessionsError } = await supabaseClient
      .from('drink_sessions')
      .select(
        `
        id,
        name,
        note,
        start_time,
        end_time,
        consumptions (
          id,
          volume,
          start_time,
          end_time,
          drink:drinks (
            name,
            alcohol,
            type
          )
        )
      `
      )
      .abortSignal(signal ?? new AbortController().signal)
      .order('start_time', { ascending: false });

    if (sessionsError) {
      return {
        success: false,
        message: 'Failed to fetch drink sessions data.',
      };
    }

    let totalConsumptions = 0;
    let totalAlcoholConsumed = 0;

    const formattedSessions = (sessionsData || []).map((session) => {
      const consumptions = session.consumptions.map((consumption) => {
        totalConsumptions++;
        const alcoholAmount = calculateGramsOfAlcohol(
          consumption.volume,
          consumption.drink.alcohol
        );
        totalAlcoholConsumed += alcoholAmount;

        return {
          id: consumption.id,
          drinkName: consumption.drink.name,
          drinkType: consumption.drink.type,
          alcoholPercentage: consumption.drink.alcohol,
          volume: consumption.volume,
          startTime: consumption.start_time,
          endTime: consumption.end_time,
        };
      });

      return {
        id: session.id,
        name: session.name,
        note: session.note ?? undefined,
        startTime: session.start_time,
        endTime: session.end_time,
        consumptions,
      };
    });

    const { data: parsedNotificationPreferences, error: notificationPreferencesError } =
      exportedNotificationPreferencesSchema.safeParse(userData.notification_preferences);

    if (notificationPreferencesError) {
      return {
        success: false,
        message:
          'Failed to parse notification preferences.\n' +
          z.prettifyError(notificationPreferencesError),
      };
    }

    const exportData: ExportedUserDataV1 = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      user: {
        id: userData.id,
        username: userData.username,
        height: userData.height,
        weight: userData.weight,
        gender: userData.gender ?? undefined,
        createdAt: userData.created_at,
        notificationPreferences: parsedNotificationPreferences,
      },
      drinkSessions: formattedSessions,
      statistics: {
        totalSessions: formattedSessions.length,
        totalConsumptions,
        totalAlcoholConsumed: Math.round(totalAlcoholConsumed * 100) / 100,
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `drinkweise-data-export-${timestamp}.json`;
    const fileUri = `${documentDirectory}${filename}`;

    await writeAsStringAsync(fileUri, jsonString);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Your Drinkweise Data',
        UTI: 'public.json',
      });
    } else {
      return {
        success: false,
        message: 'Sharing is not available on this device.',
      };
    }

    return {
      success: true,
      message: 'Your data has been exported successfully.',
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while exporting your data.',
    };
  }
}
