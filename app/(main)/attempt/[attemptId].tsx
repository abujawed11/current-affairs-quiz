// import { answerQuestion, getAttempt, submitAttempt } from "@/src/api/quiz";
// import QuestionCard from "@/src/components/QuestionCard";
// import { formatMMSS } from "@/src/utils/time";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
// import { useToast } from "react-native-toast-notifications";
// import { colors } from "@/src/utils/colors";

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



import QuestionCard from "@/src/components/QuestionCard";
import { formatMMSS } from "@/src/utils/time";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Text, TouchableOpacity, View, AppState } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { colors } from "@/src/utils/colors";
import { useAttempt, useSubmitAttempt, useAnswerQuestion } from "@/src/hooks/useQueries";

// Global state to track if user is currently in ANY test
let globalActiveAttemptId: string | null = null;

function setGlobalActiveAttempt(attemptId: string | null) {
  globalActiveAttemptId = attemptId;
}

function isAnotherTestActive(currentAttemptId: string): boolean {
  return globalActiveAttemptId !== null && globalActiveAttemptId !== currentAttemptId;
}

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
  const [isFocused, setIsFocused] = useState(true);

  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [selected, setSelected] = useState<Record<string, string | null>>({});
  const [timeUpHandled, setTimeUpHandled] = useState(false); // Prevent multiple submissions
  const [isTimeUp, setIsTimeUp] = useState(false); // Disable interactions when time is up

  const timerRef = useRef<number | null>(null);

  // Reset index when attemptId changes (component remounts or new attempt)
  useEffect(() => {
    console.log(`🎯 AttemptRunner mounted with attemptId: ${attemptId}`);
    setIndex(0); // Always start from first question
    setSelected({}); // Clear previous selections
    setTimeUpHandled(false); // Reset time up flag
    setIsTimeUp(false); // Reset time up UI state
    
    // Register this attempt as the active one
    setGlobalActiveAttempt(attemptId!);
    
    // Cleanup when component unmounts
    return () => {
      if (globalActiveAttemptId === attemptId) {
        setGlobalActiveAttempt(null);
      }
    };
  }, [attemptId]);

  // React Query hooks - force refetch for fresh attempts
  const { data: attemptData, isLoading, refetch } = useAttempt(attemptId!);
  const submitMutation = useSubmitAttempt();
  const answerMutation = useAnswerQuestion();

  // Force refetch when attemptId changes (new attempt created)
  useEffect(() => {
    if (attemptId) {
      refetch();
    }
  }, [attemptId, refetch]);

  // ---- Submit (memoized) ----
  const onSubmit = useCallback(
    async (auto = false, overrideSpent?: number) => {
      if (!attemptData) return;
      
      const spent = overrideSpent ?? (attemptData.duration_sec - secondsLeft);
      
      submitMutation.mutate(
        { attemptId: attemptId!, timeTakenSec: spent > 0 ? spent : 0 },
        {
          onSuccess: (res) => {
            // Clear timer immediately on successful submission
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            // Clear global active attempt when this test is submitted
            if (globalActiveAttemptId === attemptId) {
              setGlobalActiveAttempt(null);
            }
            
            if (auto) {
              // For time-up submissions, only show message if focused
              if (isFocused) {
                toast.show("Quiz submitted successfully!", { type: "success" });
              }
            } else {
              toast.show("Submitted!", { type: "success" });
            }
            
            // Only navigate if this test is focused
            if (isFocused) {
              router.replace({ 
                pathname: "/(main)/attempt/[attemptId]/review", 
                params: { attemptId: res.attemptId } 
              });
            }
          },
          onError: () => {
            toast.show("Submit failed", { type: "danger" });
          },
        }
      );
    },
    [attemptId, secondsLeft, attemptData, submitMutation, toast, router]
  );

  // ---- Stable refs so effects don’t depend on onSubmit ----
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // ---- Back intercept (focus-bound) without re-registering every tick ----
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setGlobalActiveAttempt(attemptId!);
      
      const unsubNav = navigation.addListener("beforeRemove", (e: any) => {
        if (submitMutation.isPending) return;
        e.preventDefault();
        Alert.alert(
          "Leave quiz?",
          "Your timer will keep running in the background.",
          [
            { text: "Keep going", style: "cancel" },
            { text: "Save & exit", onPress: () => {
              setIsFocused(false);
              // Don't clear global active attempt - timer still running
              navigation.dispatch(e.data.action);
            }},
            { text: "Submit now", style: "destructive", onPress: () => onSubmitRef.current(false) },
          ]
        );
      });

      const onHardwareBack = () => {
        if (submitMutation.isPending) return true;
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
        setIsFocused(false);
        unsubNav();
        hwSub.remove();
      };
    }, [navigation, submitMutation.isPending, attemptId])
  );

  // Initialize selected answers and timer when data loads
  useEffect(() => {
    if (!attemptData) return;

    console.log(`🔄 Loading attempt: ${attemptId}, questions: ${attemptData.questions.length}`);

    const selectedAnswers: Record<string, string | null> = {};
    attemptData.questions.forEach((q) => {
      selectedAnswers[q.questionId] = q.selected_option_id;
    });
    setSelected(selectedAnswers);

    // CRITICAL FIX: Always reset to question 1 when new attempt loads
    setIndex(0);
    console.log(`📍 Reset question index to 0 for attempt ${attemptId}`);

    const remain = attemptData.remaining_sec;
    setSecondsLeft(remain);

    if (remain <= 0 && !timeUpHandled) {
      setTimeUpHandled(true);
      setIsTimeUp(true); // Disable all interactions
      
      // 🛡️ CRITICAL FIX: Only show popup if this is the focused test
      if (isFocused && !isAnotherTestActive(attemptId!)) {
        Alert.alert(
          "⏰ Time's Up!",
          "Your quiz time has expired. Your answers will be submitted automatically.",
          [
            {
              text: "Submit Now",
              onPress: () => onSubmitRef.current(true, attemptData.duration_sec),
            },
          ],
          { cancelable: false }
        );
      } else {
        // Silent auto-submit for background tests
        console.log(`🔕 Background test ${attemptId} timed out - auto-submitting silently`);
        onSubmitRef.current(true, attemptData.duration_sec);
      }
      return;
    }

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1 && !timeUpHandled) {
          clearInterval(timerRef.current!);
          setTimeUpHandled(true);
          setIsTimeUp(true); // Disable all interactions
          
          // 🛡️ CRITICAL FIX: Only show popup if this is the focused test
          if (isFocused && !isAnotherTestActive(attemptId!)) {
            Alert.alert(
              "⏰ Time's Up!",
              "Your quiz time has expired. Your answers will be submitted automatically.",
              [
                {
                  text: "Submit Now",
                  onPress: () => onSubmitRef.current(true, attemptData.duration_sec),
                },
              ],
              { cancelable: false }
            );
          } else {
            // Silent auto-submit for background tests  
            console.log(`🔕 Background test ${attemptId} timed out - auto-submitting silently`);
            onSubmitRef.current(true, attemptData.duration_sec);
          }
          return 0;
        }
        // Show warning when 5 minutes (300 seconds) left
        if (s === 300) {
          toast.show("⚠️ 5 minutes remaining!", { type: "warning" });
        }
        // Show urgent warning when 1 minute (60 seconds) left  
        if (s === 60) {
          toast.show("🚨 1 minute remaining!", { type: "danger" });
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attemptData, attemptId, timeUpHandled]); // Add timeUpHandled dependency

  // Manual submission with confirmation
  const handleManualSubmit = useCallback(() => {
    Alert.alert(
      "Submit Test",
      "Are you sure you want to submit the test? You won't be able to change your answers after submission.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          style: "destructive",
          onPress: () => onSubmitRef.current(false),
        },
      ],
      { cancelable: true }
    );
  }, []);

  const currentQ = useMemo(() => 
    attemptData ? attemptData.questions[index] : null, 
    [attemptData, index]
  );

  function onChoose(optionId: string) {
    if (!attemptData || !currentQ || isTimeUp) return; // Block interaction if time is up
    
    // Optimistic update
    setSelected(prev => ({ ...prev, [currentQ.questionId]: optionId }));
    
    // Save to backend
    answerMutation.mutate(
      { attemptId: attemptId!, questionId: currentQ.questionId, optionId },
      {
        onError: () => {
          // Revert on error
          setSelected(prev => ({ 
            ...prev, 
            [currentQ.questionId]: attemptData.questions[index].selected_option_id 
          }));
          toast.show("Failed to save answer", { type: "danger" });
        },
      }
    );
  }

  if (isLoading || !attemptData) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.muted }}>Attempt #{attemptId}</Text>
        <Text style={{ color: colors.primary, fontWeight: "800" }}>{formatMMSS(secondsLeft)}</Text>
      </View>

      {currentQ && (
        <QuestionCard
          index={index}
          total={attemptData.questions.length}
          stem={currentQ.stem}
          options={currentQ.options}
          selectedOptionId={selected[currentQ.questionId] ?? null}
          onSelect={onChoose}
          disabled={isTimeUp} // Disable when time is up
        />
      )}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <TouchableOpacity
          disabled={index === 0 || isTimeUp}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: (index === 0 || isTimeUp) ? "#E2E8F0" : "#F8FAFC",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            alignItems: "center",
          }}
        >
          <Text style={{ color: (index === 0 || isTimeUp) ? "#94A3B8" : colors.text, fontWeight: "700" }}>Previous</Text>
        </TouchableOpacity>

        {index < attemptData.questions.length - 1 ? (
          <TouchableOpacity
            disabled={isTimeUp}
            onPress={() => setIndex((i) => i + 1)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: isTimeUp ? "#94A3B8" : colors.primary,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleManualSubmit}
            style={{ 
              flex: 1, 
              paddingVertical: 12, 
              borderRadius: 10, 
              backgroundColor: (submitMutation.isPending || isTimeUp) ? "#94A3B8" : colors.primary, 
              alignItems: "center" 
            }}
            disabled={submitMutation.isPending || isTimeUp}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>
              {submitMutation.isPending ? "Submitting..." : isTimeUp ? "Time's Up" : "Submit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

