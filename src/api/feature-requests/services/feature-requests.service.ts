import type { Failure, Success } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { PostgrestError } from '@supabase/supabase-js';

import { FeatureRequestNotFoundError } from '../errors/feature-request-not-found.error';
import type { IFeatureRequestsService } from '../interfaces/feature-requests.service-api';
import type { CreateFeatureRequestModel } from '../models/create-feature-request.model';
import type { FeatureRequestModel } from '../models/feature-request.model';
import type { PaginatedFeatureRequestsModel } from '../models/paginated-feature-requests.model';

export class FeatureRequestsService implements IFeatureRequestsService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async getFeatureRequests(
    userId?: string,
    searchQuery?: string,
    page = 0,
    limit = 20
  ): Promise<Success<PaginatedFeatureRequestsModel> | Failure<PostgrestError>> {
    let query = this.supabase
      .from('feature_requests')
      .select(
        `
        *,
        users!feature_requests_user_id_fkey(username),
        feature_request_upvotes!left(user_id)
      `,
        { count: 'exact' }
      )
      .order('upvotes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return { error };
    }

    const featureRequests: FeatureRequestModel[] = (data || []).map((request) => ({
      id: request.id,
      title: request.title,
      description: request.description,
      user_id: request.user_id,
      status: request.status,
      upvotes_count: request.upvotes_count,
      created_at: request.created_at,
      updated_at: request.updated_at,
      username: request.users?.username || 'Anonymous',
      user_has_upvoted: userId
        ? request.feature_request_upvotes?.some((upvote: any) => upvote.user_id === userId)
        : false,
    }));

    return {
      data: {
        data: featureRequests,
        count: count || 0,
        hasMore: (page + 1) * limit < (count || 0),
      },
    };
  }

  public async createFeatureRequest(
    userId: string,
    request: CreateFeatureRequestModel
  ): Promise<Success<FeatureRequestModel> | Failure<PostgrestError>> {
    const { data, error } = await this.supabase
      .from('feature_requests')
      .insert({
        title: request.title,
        description: request.description,
        user_id: userId,
      })
      .select(
        `
        *,
        users!feature_requests_user_id_fkey(username)
      `
      )
      .single();

    if (error) {
      return { error };
    }

    const featureRequest: FeatureRequestModel = {
      id: data.id,
      title: data.title,
      description: data.description,
      user_id: data.user_id,
      status: data.status,
      upvotes_count: data.upvotes_count,
      created_at: data.created_at,
      updated_at: data.updated_at,
      username: data.users?.username || 'Anonymous',
      user_has_upvoted: false,
    };

    return { data: featureRequest };
  }

  public async toggleUpvote(
    featureRequestId: string,
    userId: string
  ): Promise<Success<{ upvoted: boolean; upvotes_count: number }> | Failure<PostgrestError>> {
    // Check if user has already upvoted
    const { data: existingUpvote, error: checkError } = await this.supabase
      .from('feature_request_upvotes')
      .select('id')
      .eq('feature_request_id', featureRequestId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned", which is expected if no upvote exists
      return { error: checkError };
    }

    let upvoted: boolean;

    if (existingUpvote) {
      // Remove upvote
      const { error: deleteError } = await this.supabase
        .from('feature_request_upvotes')
        .delete()
        .eq('id', existingUpvote.id);

      if (deleteError) {
        return { error: deleteError };
      }

      upvoted = false;
    } else {
      // Add upvote
      const { error: insertError } = await this.supabase
        .from('feature_request_upvotes')
        .insert({
          feature_request_id: featureRequestId,
          user_id: userId,
        });

      if (insertError) {
        return { error: insertError };
      }

      upvoted = true;
    }

    // Get updated upvotes count
    const { data: updatedRequest, error: fetchError } = await this.supabase
      .from('feature_requests')
      .select('upvotes_count')
      .eq('id', featureRequestId)
      .single();

    if (fetchError) {
      return { error: fetchError };
    }

    return {
      data: {
        upvoted,
        upvotes_count: updatedRequest.upvotes_count,
      },
    };
  }

  public async deleteFeatureRequest(
    featureRequestId: string,
    userId: string
  ): Promise<Failure<PostgrestError | FeatureRequestNotFoundError> | undefined> {
    const { data, error } = await this.supabase
      .from('feature_requests')
      .delete()
      .eq('id', featureRequestId)
      .eq('user_id', userId)
      .select('id');

    if (error) {
      return { error };
    }

    if (!data || data.length === 0) {
      return { error: FeatureRequestNotFoundError.fromId(featureRequestId) };
    }
  }
}