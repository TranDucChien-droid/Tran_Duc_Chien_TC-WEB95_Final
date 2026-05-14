# TanStack Query Pattern Guide (React)

## 1. Overview

This guide defines a **scalable and maintainable pattern** for using TanStack Query in React apps.

### Goals

- Separation of concerns
- Reusable hooks
- Centralized API logic
- Predictable caching and invalidation
- Scalable structure

---

## 2. Recommended Folder Structure

```text
src/
├── services/       # API layer (axios)
├── hooks/          # React Query hooks
├── queryKeys/      # Query key factory
├── providers/      # QueryClientProvider setup
├── types/          # TypeScript types
└── utils/
```

---

## 3. Query Key Factory Pattern

Always centralize query keys to avoid duplication and bugs.

```ts
// src/queryKeys/quizKeys.ts
export const quizKeys = {
  all: ["quizzes"] as const,

  lists: () => [...quizKeys.all, "list"] as const,

  list: (filters: { page?: number }) => [...quizKeys.lists(), filters] as const,

  details: () => [...quizKeys.all, "detail"] as const,

  detail: (id: string) => [...quizKeys.details(), id] as const,
};
```

---

## 4. API Layer (Axios)

Keep API logic isolated from React Query.

```ts
// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Global error handling
    console.error(err.response?.data || err.message);
    return Promise.reject(err);
  }
);
```

```ts
// src/services/quiz.service.ts
import { api } from "./api";

export const getQuizzes = async (params?: { page?: number }) => {
  const { data } = await api.get("/quizzes", { params });
  return data;
};

export const getQuizDetail = async (id: string) => {
  const { data } = await api.get(`/quizzes/${id}`);
  return data;
};

export const createQuiz = async (payload: unknown) => {
  const { data } = await api.post("/quizzes", payload);
  return data;
};
```

---

## 5. Query Hooks Pattern

Encapsulate all query logic inside hooks.

```ts
// src/hooks/useQuizzes.ts
import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "@/services/quiz.service";
import { quizKeys } from "@/queryKeys/quizKeys";

export const useQuizzes = (filters?: { page?: number }) => {
  return useQuery({
    queryKey: quizKeys.list(filters || {}),
    queryFn: () => getQuizzes(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

---

## 6. Detail Query Pattern

```ts
// src/hooks/useQuizDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getQuizDetail } from "@/services/quiz.service";
import { quizKeys } from "@/queryKeys/quizKeys";

export const useQuizDetail = (id: string) => {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => getQuizDetail(id),
    enabled: !!id,
  });
};
```

---

## 7. Mutation Pattern

```ts
// src/hooks/useCreateQuiz.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuiz } from "@/services/quiz.service";
import { quizKeys } from "@/queryKeys/quizKeys";

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuiz,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.all,
      });
    },
  });
};
```

---

## 8. Component Usage

```tsx
const QuizList = () => {
  const { data, isLoading, isError } = useQuizzes();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading quizzes</div>;

  return (
    <div>
      {data.map((quiz: { _id: string; title: string }) => (
        <div key={quiz._id}>{quiz.title}</div>
      ))}
    </div>
  );
};
```

---

## 9. Pagination Pattern

```ts
useQuery({
  queryKey: quizKeys.list({ page }),
  queryFn: () => getQuizzes({ page }),
  placeholderData: (previousData) => previousData,
});
```

Note: In TanStack Query v5, `keepPreviousData` was replaced with `placeholderData` (or use `usePlaceholderData` / `placeholderData` from the library). Adjust to your installed major version.

---

## 10. Infinite Query Pattern

```ts
import { useInfiniteQuery } from "@tanstack/react-query";

useInfiniteQuery({
  queryKey: quizKeys.lists(),
  queryFn: ({ pageParam }) => getQuizzes({ page: pageParam as number }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
});
```

Note: v5 requires `initialPageParam` for infinite queries. Adapt `getNextPageParam` to your API response shape.

---

## 11. Optimistic Updates (Advanced)

```ts
useMutation({
  mutationFn: createQuiz,

  onMutate: async (newQuiz) => {
    await queryClient.cancelQueries({ queryKey: quizKeys.all });

    const previous = queryClient.getQueryData(quizKeys.lists());

    queryClient.setQueryData(quizKeys.lists(), (old: unknown) => [...(Array.isArray(old) ? old : []), newQuiz]);

    return { previous };
  },

  onError: (_err, _newQuiz, context) => {
    queryClient.setQueryData(quizKeys.lists(), context?.previous);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: quizKeys.all });
  },
});
```

---

## 12. Best Practices

- Always use a query key factory.
- Separate the API layer from hooks.
- Use mutations for writes.
- Invalidate only the queries that must refresh.
- Use `enabled` for conditional fetching.
- Use `staleTime` to reduce unnecessary refetching.
- Avoid calling APIs directly from components when a hook or service already expresses that operation.

---

## 13. Optional Enhancements

- TanStack Query Devtools
- Prefetching (router-based)
- SSR / hydration
- Global loading indicators
- Request cancellation

---

## Conclusion

This pattern gives you:

- Clean architecture
- Scalable data fetching
- A maintainable codebase
- Predictable caching behavior
