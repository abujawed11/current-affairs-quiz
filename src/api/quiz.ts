// import api from "./client";

// export type Test = { id: number; title: string; duration_sec: number };
// export type TestDetail = { id: number; title: string; duration_sec: number; question_count: number };
// export type Option = { id: number; text: string };
// export type Question = { id: number; date: string; category: string; stem: string; options: Option[] };

// export async function fetchTests(): Promise<Test[]> {
//   const { data } = await api.get("/tests");
//   return data;
// }

// export async function fetchTestDetail(id: number): Promise<TestDetail> {
//   const { data } = await api.get(`/tests/${id}`);
//   return data;
// }

// export async function startAttempt(testId: number): Promise<{ attempt_id: number; test_id: number; questions: Question[] }> {
//   const { data } = await api.post("/attempts", { test_id: testId });
//   return data;
// }

// export async function answerQuestion(attemptId: number, questionId: number, optionId: number) {
//   const { data } = await api.post(`/attempts/${attemptId}/answer`, { question_id: questionId, option_id: optionId });
//   return data;
// }

// export async function submitAttempt(attemptId: number, timeTakenSec: number) {
//   const { data } = await api.post(`/attempts/${attemptId}/submit`, { time_taken_sec: timeTakenSec });
//   return data as { attempt_id: number; score: number; total: number; accuracy_pct: number };
// }

// export async function reviewAttempt(attemptId: number) {
//   const { data } = await api.get(`/attempts/${attemptId}/review`);
//   return data as {
//     attempt_id: number;
//     score: number;
//     total: number;
//     accuracy_pct: number;
//     questions: { id: number; stem: string; explanation: string; options: { id: number; text: string; is_correct: boolean; selected: boolean }[] }[];
//   };
// }

// export async function getAttempt(attemptId: number): Promise<{
//   attempt_id: number;
//   test_id: number;
//   duration_sec: number;
//   started_at: string;
//   remaining_sec: number; // 👈
//   questions: { id: number; date: string; category: string; stem: string; selected_option_id: number | null; options: Option[] }[];
// }> {
//   const { data } = await api.get(`/attempts/${attemptId}`);
//   return data;
// }



import api from "./client";

export type Test = { testId: string; title: string; duration_sec: number; category?: string; date?: string };
export type TestDetail = { testId: string; title: string; duration_sec: number; question_count: number };

export type Option = { optionId: string; text: string };
export type Question = {
  questionId: string;
  date: string;        // ISO
  category: string;
  stem: string;
  options: Option[];
};

export async function fetchTests(): Promise<Test[]> {
  const { data } = await api.get("/tests");
  return data;
}

export async function fetchTestDetail(testId: string): Promise<TestDetail> {
  const { data } = await api.get(`/tests/${testId}`);
  return data;
}

export async function startAttempt(
  testId: string, 
  forceNew = false
): Promise<{ attemptId: string; testId: string; questions: Question[] }> {
  const { data } = await api.post("/attempts", { testId, forceNew });
  return data;
}

export async function answerQuestion(attemptId: string, questionId: string, optionId: string) {
  const { data } = await api.post(`/attempts/${attemptId}/answer`, { questionId, optionId });
  return data;
}

export async function submitAttempt(
  attemptId: string,
  timeTakenSec: number
): Promise<{ attemptId: string; score: number; total: number; accuracy_pct: number }> {
  const { data } = await api.post(`/attempts/${attemptId}/submit`, { time_taken_sec: timeTakenSec });
  return { ...data, attemptId }; // Ensure attemptId is included
}

export async function reviewAttempt(attemptId: string): Promise<{
  attemptId: string;
  testId: string;
  score: number;
  total: number;
  accuracy_pct: number;
  questions: {
    questionId: string;
    stem: string;
    explanation: string;
    options: { optionId: string; text: string; is_correct: boolean; selected: boolean }[];
  }[];
}> {
  const { data } = await api.get(`/attempts/${attemptId}/review`);
  return data;
}

export async function getAttempt(
  attemptId: string
): Promise<{
  attemptId: string;
  testId: string;
  duration_sec: number;
  started_at: string;
  remaining_sec: number;
  questions: { questionId: string; date: string; category: string; stem: string; selected_option_id: string | null; options: Option[] }[];
}> {
  const { data } = await api.get(`/attempts/${attemptId}`);
  return data;
}

// Use existing /me/attempts endpoint and filter by testId
export async function getTestAttempts(testId: string): Promise<Array<{
  attemptId: string;
  score: number;
  total: number;
  accuracy_pct: number;
  submitted_at: string;
  time_taken_sec?: number; // Make optional since backend might not have it
}>> {
  const { data } = await api.get("/me/attempts");
  // Filter attempts for specific test
  return data.filter((attempt: any) => attempt.testId === testId);
}
