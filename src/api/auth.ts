// import api from "./client";

// export async function signup(
//   username: string,
//   email: string,
//   password: string
// ): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
//   const { data } = await api.post("/auth/signup", { username, email, password });
//   return data;
// }


// export async function loginWithUsername(
//   username: string,
//   password: string
// ): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
//   const { data } = await api.post("/auth/login", { username, password });
//   return data;
// }

// export async function myAttempts(): Promise<Array<{ id: number; test_id: number; title: string; score: number; total: number; accuracy_pct: number; submitted_at: string }>> {
//   const { data } = await api.get("/me/attempts");
//   return data;
// }



import api from "./client";

export type AuthUser = { userId: string; username: string; email: string };

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/signup", { username, email, password });
  return data;
}

export async function loginWithUsername(
  username: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/login", { username, password });
  return data;
}

/** Matches backend /me/attempts summary (now using codes) */
export async function myAttempts(): Promise<
  Array<{
    attemptId: string;
    testId: string;
    title: string;
    score: number;
    total: number;
    accuracy_pct: number;
    submitted_at: string;
  }>
> {
  const { data } = await api.get("/me/attempts");
  return data;
}


export type InProgress =
  | { attemptId: string; testId: string; title: string; started_at: string }
  | null;

export async function inProgress(): Promise<InProgress> {
  const { data } = await api.get("/me/inprogress");
  // backend returns either an object or null
  return data ?? null;
}