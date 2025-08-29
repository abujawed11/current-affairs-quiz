import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as AuthApi from '../api/auth';
import * as QuizApi from '../api/quiz';
import { useAuthProvider } from './useAuth';

// User-specific Query Keys
export const queryKeys = {
  myAttempts: (userId?: string) => ['myAttempts', userId] as const,
  inProgress: (userId?: string) => ['inProgress', userId] as const,
  tests: ['tests'] as const, // Tests are global, not user-specific
  testDetail: (id: string) => ['testDetail', id] as const,
  testAttempts: (testId: string, userId?: string) => ['testAttempts', testId, userId] as const,
  attemptReview: (attemptId: string) => ['attemptReview', attemptId] as const,
  attempt: (attemptId: string) => ['attempt', attemptId] as const,
};

// Dashboard Queries
export function useMyAttempts() {
  const { user } = useAuthProvider();
  
  return useQuery({
    queryKey: queryKeys.myAttempts(user?.userId),
    queryFn: AuthApi.myAttempts,
    enabled: !!user, // Only run when user is authenticated
  });
}

export function useInProgress() {
  const { user } = useAuthProvider();
  
  return useQuery({
    queryKey: queryKeys.inProgress(user?.userId),
    queryFn: AuthApi.inProgress,
    enabled: !!user, // Only run when user is authenticated
  });
}

export function useTests() {
  return useQuery({
    queryKey: queryKeys.tests,
    queryFn: QuizApi.fetchTests,
  });
}

// Test Detail Queries
export function useTestDetail(testId: string) {
  return useQuery({
    queryKey: queryKeys.testDetail(testId),
    queryFn: () => QuizApi.fetchTestDetail(testId),
    enabled: !!testId,
  });
}

export function useTestAttempts(testId: string) {
  const { user } = useAuthProvider();
  
  return useQuery({
    queryKey: queryKeys.testAttempts(testId, user?.userId),
    queryFn: () => QuizApi.getTestAttempts(testId),
    enabled: !!testId && !!user,
  });
}

// Attempt Queries
export function useAttemptReview(attemptId: string) {
  return useQuery({
    queryKey: queryKeys.attemptReview(attemptId),
    queryFn: () => QuizApi.reviewAttempt(attemptId),
    enabled: !!attemptId,
  });
}

export function useAttempt(attemptId: string, options?: any) {
  return useQuery({
    queryKey: queryKeys.attempt(attemptId),
    queryFn: () => QuizApi.getAttempt(attemptId),
    enabled: !!attemptId,
    ...options,
  });
}

// Mutations
export function useStartAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, forceNew = false }: { testId: string; forceNew?: boolean }) =>
      QuizApi.startAttempt(testId, forceNew),
    onSuccess: (data, variables) => {
      // If forceNew=true, we need to clear all cached attempt data
      if (variables.forceNew) {
        // Remove all attempt queries from cache
        queryClient.removeQueries({ 
          queryKey: ['attempt'],
          exact: false 
        });
        // Clear any cached attempt data
        queryClient.clear();
      }
      
      // Invalidate in-progress query to show the new attempt
      queryClient.invalidateQueries({ queryKey: queryKeys.inProgress });
      // Invalidate test attempts for this test
      queryClient.invalidateQueries({ queryKey: queryKeys.testAttempts(variables.testId) });
    },
  });
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ attemptId, timeTakenSec }: { attemptId: string; timeTakenSec: number }) =>
      QuizApi.submitAttempt(attemptId, timeTakenSec),
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.myAttempts });
      queryClient.invalidateQueries({ queryKey: queryKeys.inProgress });
      // Invalidate all testAttempts queries since we don't know which test this belongs to
      queryClient.invalidateQueries({ 
        queryKey: ['testAttempts'],
        exact: false
      });
      
      // Remove the specific attempt from cache since it's now completed
      queryClient.removeQueries({ queryKey: queryKeys.attempt(variables.attemptId) });
    },
  });
}

export function useAnswerQuestion() {
  return useMutation({
    mutationFn: ({ attemptId, questionId, optionId }: { 
      attemptId: string; 
      questionId: string; 
      optionId: string; 
    }) => QuizApi.answerQuestion(attemptId, questionId, optionId),
    // Don't invalidate queries for answer updates - they're optimistic
  });
}

// Cache invalidation helpers
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateMyAttempts: () => 
      queryClient.invalidateQueries({ queryKey: queryKeys.myAttempts }),
    
    invalidateInProgress: () => 
      queryClient.invalidateQueries({ queryKey: queryKeys.inProgress }),
    
    invalidateTestAttempts: (testId: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.testAttempts(testId) }),
    
    invalidateAll: () => 
      queryClient.invalidateQueries(),
  };
}