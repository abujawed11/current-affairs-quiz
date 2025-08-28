// import { answerQuestion, getAttempt, submitAttempt } from "@/src/api/quiz";
// import QuestionCard from "@/src/components/QuestionCard";
// import { formatMMSS } from "@/src/utils/time";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
// import { useToast } from "react-native-toast-notifications";
// import { colors } from "../../_layout.theme";

// type AttemptState = {
//   questions: {
//     id: number;
//     stem: string;
//     options: { id: number; text: string }[];
//   }[];
//   selected: Record<number, number | null>;
//   durationSec: number;
//   startedAt: string; // ISO
// };

// export default function AttemptRunner() {
//   const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
//   const [state, setState] = useState<AttemptState | null>(null);
//   const [index, setIndex] = useState(0);
//   const [secondsLeft, setSecondsLeft] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const toast = useToast();
//   const timerRef = useRef<number | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const d = await getAttempt(Number(attemptId));

//         const selected: Record<number, number | null> = {};
//         d.questions.forEach(q => (selected[q.id] = q.selected_option_id));
//         setState({
//           questions: d.questions.map(q => ({ id: q.id, stem: q.stem, options: q.options })),
//           selected,
//           durationSec: d.duration_sec,
//           startedAt: d.started_at,
//         });

//         // compute remaining from server time
//         const elapsed = Math.floor((Date.now() - new Date(d.started_at).getTime()) / 1000);
//         // const remain = Math.max(d.duration_sec - elapsed, 0);
//         const remain = d.remaining_sec;       
//         setSecondsLeft(remain);

//         if (remain <= 0) {
//           // time’s up already
//           toast.show("Time up! Auto-submitting.", { type: "warning" });
//           await onSubmit(true, 0);
//           return;
//         }

//         timerRef.current && clearInterval(timerRef.current);
//         timerRef.current = setInterval(() => {
//           setSecondsLeft((s) => {
//             if (s <= 1) {
//               clearInterval(timerRef.current!);
//               onSubmit(true, 0).catch(() => {});
//               return 0;
//             }
//             return s - 1;
//           });
//         }, 1000);
//       } catch (e) {
//         console.error(e);
//         toast.show("Unable to load attempt", { type: "danger" });
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => {
//       timerRef.current && clearInterval(timerRef.current);
//     };
//   }, [attemptId]);

//   const currentQ = useMemo(() => (state ? state.questions[index] : null), [state, index]);

//   async function onChoose(optionId: number) {
//     if (!state || !currentQ) return;
//     try {
//       setState(prev => prev ? { ...prev, selected: { ...prev.selected, [currentQ.id]: optionId } } : prev);
//       await answerQuestion(Number(attemptId), currentQ.id, optionId);
//     } catch (e) {
//       toast.show("Failed to save answer", { type: "danger" });
//     }
//   }

//   async function onSubmit(auto = false, overrideSpent?: number) {
//     try {
//       setSubmitting(true);
//       const spent = overrideSpent ?? (state ? state.durationSec - secondsLeft : 0);
//       const res = await submitAttempt(Number(attemptId), spent > 0 ? spent : 0);
//       if (auto) toast.show("Time up! Auto-submitted.", { type: "warning" });
//       router.replace({ pathname: "../attempt/[attemptId]/review", params: { attemptId: String(res.attempt_id) } });
//     } catch (e) {
//       toast.show("Submit failed", { type: "danger" });
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading || !state) return <ActivityIndicator style={{ marginTop: 32 }} />;

//   return (
//     <View style={{ flex: 1, padding: 16, gap: 16 }}>
//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//         <Text style={{ color: colors.muted }}>Attempt #{attemptId}</Text>
//         <Text style={{ color: colors.primary, fontWeight: "800" }}>{formatMMSS(secondsLeft)}</Text>
//       </View>

//       {currentQ && (
//         <QuestionCard
//           index={index}
//           total={state.questions.length}
//           stem={currentQ.stem}
//           options={currentQ.options}
//           selectedOptionId={state.selected[currentQ.id] ?? null}
//           onSelect={onChoose}
//         />
//       )}

//       <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
//         <TouchableOpacity
//           disabled={index === 0}
//           onPress={() => setIndex((i) => Math.max(0, i - 1))}
//           style={{
//             flex: 1,
//             paddingVertical: 12,
//             borderRadius: 10,
//             backgroundColor: index === 0 ? "#E2E8F0" : "#F8FAFC",
//             borderWidth: 1,
//             borderColor: "#CBD5E1",
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ color: index === 0 ? "#94A3B8" : colors.text, fontWeight: "700" }}>Previous</Text>
//         </TouchableOpacity>

//         {index < state.questions.length - 1 ? (
//           <TouchableOpacity
//             disabled={!state.selected[currentQ!.id]}
//             onPress={() => setIndex((i) => i + 1)}
//             style={{
//               flex: 1,
//               paddingVertical: 12,
//               borderRadius: 10,
//               backgroundColor: state.selected[currentQ!.id] ? colors.primary : "#94A3B8",
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ color: "#fff", fontWeight: "800" }}>Next</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             onPress={() => onSubmit(false)}
//             style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}
//             disabled={submitting}
//           >
//             <Text style={{ color: "#fff", fontWeight: "800" }}>{submitting ? "Submitting..." : "Submit"}</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }



import { answerQuestion, getAttempt, submitAttempt } from "@/src/api/quiz";
import QuestionCard from "@/src/components/QuestionCard";
import { formatMMSS } from "@/src/utils/time";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Text, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { colors } from "../../_layout.theme";

type AttemptState = {
  questions: { questionId: string; stem: string; options: { optionId: string; text: string }[] }[];
  selected: Record<string, string | null>;
  durationSec: number;
  startedAt: string;
};

export default function AttemptRunner() {
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const navigation = useNavigation();
  const toast = useToast();

  const [state, setState] = useState<AttemptState | null>(null);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef<number | null>(null);

  // ---- Submit (memoized) ----
  const onSubmit = useCallback(
    async (auto = false, overrideSpent?: number) => {
      try {
        setSubmitting(true);
        const spent = overrideSpent ?? (state ? state.durationSec - secondsLeft : 0);
        const res = await submitAttempt(attemptId!, spent > 0 ? spent : 0);
        if (auto) toast.show("Time up! Auto-submitted.", { type: "warning" });
        else toast.show("Submitted!", { type: "success" });
        router.replace({ pathname: "../attempt/[attemptId]/review", params: { attemptId: res.attemptId } });
      } catch {
        toast.show("Submit failed", { type: "danger" });
      } finally {
        setSubmitting(false);
      }
    },
    [attemptId, secondsLeft, state, toast]
  );

  // ---- Stable refs so effects don’t depend on onSubmit ----
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // ---- Back intercept (focus-bound) without re-registering every tick ----
  useFocusEffect(
    useCallback(() => {
      const unsubNav = navigation.addListener("beforeRemove", (e: any) => {
        if (submitting) return;
        e.preventDefault();
        Alert.alert(
          "Leave quiz?",
          "Your timer will keep running in the background.",
          [
            { text: "Keep going", style: "cancel" },
            { text: "Save & exit", onPress: () => navigation.dispatch(e.data.action) },
            { text: "Submit now", style: "destructive", onPress: () => onSubmitRef.current(false) },
          ]
        );
      });

      const onHardwareBack = () => {
        if (submitting) return true;
        Alert.alert(
          "Leave quiz?",
          "Your timer will keep running in the background.",
          [
            { text: "Keep going", style: "cancel" },
            { text: "Save & exit", onPress: () => navigation.goBack() },
            { text: "Submit now", style: "destructive", onPress: () => onSubmitRef.current(false) },
          ]
        );
        return true;
      };
      const hwSub = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);

      return () => {
        unsubNav();
        hwSub.remove();
      };
    }, [navigation, submitting]) // <- no onSubmit here
  );

  // ---- Load attempt once per attemptId (no onSubmit dep) ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const d = await getAttempt(attemptId!);
        if (cancelled) return;

        const selected: Record<string, string | null> = {};
        d.questions.forEach((q) => (selected[q.questionId] = q.selected_option_id));

        setState({
          questions: d.questions.map((q) => ({ questionId: q.questionId, stem: q.stem, options: q.options })),
          selected,
          durationSec: d.duration_sec,
          startedAt: d.started_at,
        });

        const remain = d.remaining_sec;
        setSecondsLeft(remain);

        if (remain <= 0) {
          // use the ref so we don't depend on onSubmit
          onSubmitRef.current(true, 0);
          return;
        }

        // start ticking
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setSecondsLeft((s) => {
            if (s <= 1) {
              clearInterval(timerRef.current!);
              onSubmitRef.current(true, 0);
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      } catch (e) {
        console.error(e);
        toast.show("Unable to load attempt", { type: "danger" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attemptId]); // <- ONLY attemptId

  const currentQ = useMemo(() => (state ? state.questions[index] : null), [state, index]);

  async function onChoose(optionId: string) {
    if (!state || !currentQ) return;
    try {
      // optimistic update
      setState((prev) => (prev ? { ...prev, selected: { ...prev.selected, [currentQ.questionId]: optionId } } : prev));
      await answerQuestion(attemptId!, currentQ.questionId, optionId);
    } catch {
      toast.show("Failed to save answer", { type: "danger" });
    }
  }

  if (loading || !state) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.muted }}>Attempt #{attemptId}</Text>
        <Text style={{ color: colors.primary, fontWeight: "800" }}>{formatMMSS(secondsLeft)}</Text>
      </View>

      {currentQ && (
        <QuestionCard
          index={index}
          total={state.questions.length}
          stem={currentQ.stem}
          options={currentQ.options}
          selectedOptionId={state.selected[currentQ.questionId] ?? null}
          onSelect={onChoose}
        />
      )}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <TouchableOpacity
          disabled={index === 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: index === 0 ? "#E2E8F0" : "#F8FAFC",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            alignItems: "center",
          }}
        >
          <Text style={{ color: index === 0 ? "#94A3B8" : colors.text, fontWeight: "700" }}>Previous</Text>
        </TouchableOpacity>

        {index < state.questions.length - 1 ? (
          <TouchableOpacity
            disabled={!state.selected[currentQ!.questionId]}
            onPress={() => setIndex((i) => i + 1)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: state.selected[currentQ!.questionId] ? colors.primary : "#94A3B8",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onSubmitRef.current(false)}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}
            disabled={submitting}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>{submitting ? "Submitting..." : "Submit"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

