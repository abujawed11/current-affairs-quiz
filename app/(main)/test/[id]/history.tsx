import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/src/utils/colors";
import { useTestAttempts, useTestDetail } from "@/src/hooks/useQueries";
import { useQuery } from '@tanstack/react-query';
import * as QuizApi from "@/src/api/quiz";
import { formatIndianDate, formatIndianTime } from "@/src/utils/time";

// Type definitions for enhanced analytics
type BasicAttempt = {
  attemptId: string;
  score: number;
  total: number;
  accuracy_pct: number;
  submitted_at: string;
  time_taken_sec?: number;
};

type DetailedAttempt = BasicAttempt & {
  questions: {
    questionId: string;
    stem: string;
    explanation: string;
    category?: string;
    options: { optionId: string; text: string; is_correct: boolean; selected: boolean }[];
  }[];
};

export default function TestHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: attempts = [], isLoading: attemptsLoading } = useTestAttempts(id!);
  const { data: testData, isLoading: testLoading } = useTestDetail(id!);

  const loading = attemptsLoading || testLoading;

  const formatTime = (seconds?: number | null) => {
    if (!seconds || seconds <= 0) return "Not recorded";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Enhanced analytics calculations
  const getDetailedAnalytics = async (): Promise<DetailedAttempt[]> => {
    if (attempts.length === 0) return [];
    
    // Get detailed data for all attempts
    const detailedAttempts = await Promise.all(
      attempts.map(async (attempt: BasicAttempt) => {
        try {
          const review = await QuizApi.reviewAttempt(attempt.attemptId);
          return { ...attempt, questions: review.questions } as DetailedAttempt;
        } catch (error) {
          console.log(`Failed to fetch detailed data for attempt ${attempt.attemptId}:`, error);
          return null; // Return null for failed attempts
        }
      })
    );
    
    // Filter out null values and return only successful detailed attempts
    return detailedAttempts.filter((attempt): attempt is DetailedAttempt => 
      attempt !== null && attempt.questions && attempt.questions.length > 0
    );
  };

  const { data: detailedAttempts = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['detailedAnalytics', id, attempts.length, attempts.map(a => a.attemptId).join(',')],
    queryFn: getDetailedAnalytics,
    enabled: attempts.length > 0,
    staleTime: 1000, // Reduce cache time to 1 second for faster updates
  });

  // Calculate comprehensive statistics
  const getComprehensiveStats = () => {
    if (!detailedAttempts || detailedAttempts.length === 0) return null;

    let totalCorrect = 0;
    let totalWrong = 0;
    let totalUnanswered = 0;
    let totalQuestions = 0;
    let categoryStats: Record<string, { correct: number; total: number }> = {};
    let timePerQuestion: number[] = [];

    detailedAttempts.forEach((attempt: DetailedAttempt) => {
      const attemptCorrect = attempt.questions.filter(q => 
        q.options.some(opt => opt.selected && opt.is_correct)
      ).length;
      
      const attemptWrong = attempt.questions.filter(q => 
        q.options.some(opt => opt.selected && !opt.is_correct)
      ).length;
      
      const attemptUnanswered = attempt.questions.filter(q => 
        !q.options.some(opt => opt.selected)
      ).length;

      totalCorrect += attemptCorrect;
      totalWrong += attemptWrong;
      totalUnanswered += attemptUnanswered;
      totalQuestions += attempt.questions.length;

      // Category analysis (if available)
      attempt.questions.forEach(q => {
        if (q.category) {
          if (!categoryStats[q.category]) {
            categoryStats[q.category] = { correct: 0, total: 0 };
          }
          categoryStats[q.category].total++;
          if (q.options.some(opt => opt.selected && opt.is_correct)) {
            categoryStats[q.category].correct++;
          }
        }
      });

      // Time analysis
      if (attempt.time_taken_sec && attempt.questions.length > 0) {
        timePerQuestion.push(attempt.time_taken_sec / attempt.questions.length);
      }
    });

    const avgTimePerQuestion = timePerQuestion.length > 0 
      ? timePerQuestion.reduce((sum, time) => sum + time, 0) / timePerQuestion.length 
      : 0;

    return {
      totalCorrect,
      totalWrong,
      totalUnanswered,
      totalQuestions,
      categoryStats,
      avgTimePerQuestion,
      accuracyTrend: attempts.map(a => a.accuracy_pct),
      improvementRate: attempts.length > 1 
        ? ((attempts[0].accuracy_pct - attempts[attempts.length - 1].accuracy_pct) / attempts.length)
        : 0
    };
  };

  const stats = getComprehensiveStats();

  const getGradeColor = (accuracy: number) => {
    if (accuracy >= 80) return "#10B981"; // green
    if (accuracy >= 60) return "#F59E0B"; // yellow
    return "#EF4444"; // red
  };

  const getGradeLetter = (accuracy: number) => {
    if (accuracy >= 90) return "A+";
    if (accuracy >= 80) return "A";
    if (accuracy >= 70) return "B";
    if (accuracy >= 60) return "C";
    return "D";
  };

  if (loading || analyticsLoading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.accuracy_pct)) : 0;
  const avgScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.accuracy_pct, 0) / attempts.length : 0;
  const validTimes = attempts.filter(a => a.time_taken_sec && a.time_taken_sec > 0);
  const totalTime = validTimes.reduce((sum, a) => sum + (a.time_taken_sec || 0), 0);
  const hasTimeData = validTimes.length > 0;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
          {testData?.title || "Test"} - History
        </Text>

        {/* Enhanced Performance Overview */}
        {stats && (
          <View style={{ 
            backgroundColor: colors.card, 
            borderRadius: 12, 
            padding: 16, 
            borderWidth: 1, 
            borderColor: "#E2E8F0" 
          }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
              📊 Detailed Analysis {detailedAttempts.length > 0 ? `(${detailedAttempts.length} attempts analyzed)` : ''}
            </Text>
            
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <View style={{ backgroundColor: "#10B981", borderRadius: 8, padding: 12, minWidth: 80, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>CORRECT</Text>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{stats.totalCorrect}</Text>
              </View>
              
              <View style={{ backgroundColor: "#EF4444", borderRadius: 8, padding: 12, minWidth: 80, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>WRONG</Text>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{stats.totalWrong}</Text>
              </View>
              
              <View style={{ backgroundColor: "#F59E0B", borderRadius: 8, padding: 12, minWidth: 80, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>SKIPPED</Text>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{stats.totalUnanswered}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <View>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Accuracy Rate</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                  {Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100) || 0}%
                </Text>
              </View>
              
              <View>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Avg Time/Question</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                  {stats.avgTimePerQuestion > 0 ? `${Math.round(stats.avgTimePerQuestion)}s` : "N/A"}
                </Text>
              </View>
              
              <View>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Improvement</Text>
                <Text style={{ 
                  color: stats.improvementRate >= 0 ? "#10B981" : "#EF4444", 
                  fontWeight: "700", 
                  fontSize: 16 
                }}>
                  {stats.improvementRate >= 0 ? "+" : ""}{Math.round(stats.improvementRate)}%
                </Text>
              </View>
            </View>

            {/* Category Performance */}
            {Object.keys(stats.categoryStats).length > 0 && (
              <View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                  📚 Category Performance
                </Text>
                {Object.entries(stats.categoryStats).map(([category, data]) => (
                  <View key={category} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: colors.text, fontSize: 12, flex: 1 }}>
                      {category}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }}>
                      {data.correct}/{data.total} ({Math.round((data.correct / data.total) * 100)}%)
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Summary Stats */}
        <View style={{ 
          backgroundColor: colors.card, 
          borderRadius: 12, 
          padding: 16, 
          borderWidth: 1, 
          borderColor: "#E2E8F0" 
        }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 12 }}>
            Overall Performance
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>🏆 Best Score</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>
                {Math.round(bestScore)}%
              </Text>
              <Text style={{ 
                color: getGradeColor(bestScore), 
                fontWeight: "600", 
                fontSize: 14 
              }}>
                {getGradeLetter(bestScore)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>📈 Average</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>
                {Math.round(avgScore)}%
              </Text>
              <Text style={{ 
                color: getGradeColor(avgScore), 
                fontWeight: "600", 
                fontSize: 14 
              }}>
                {getGradeLetter(avgScore)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>🎯 Attempts</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>
                {attempts.length}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                {hasTimeData ? `${formatTime(totalTime)} total` : "Time not tracked"}
              </Text>
            </View>
          </View>
        </View>

        {/* Individual Attempts */}
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
          Attempt History
        </Text>

        {attempts.map((attempt, index) => (
          <View
            key={attempt.attemptId}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                Attempt #{attempts.length - index}
              </Text>
              <View style={{
                backgroundColor: getGradeColor(attempt.accuracy_pct),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  {getGradeLetter(attempt.accuracy_pct)}
                </Text>
              </View>
            </View>

            {/* Enhanced attempt details with breakdown */}
            <View style={{ marginBottom: 12 }}>
              {/* Score and time row */}
              <View style={{ flexDirection: "row", gap: 16, marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Score</Text>
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    {attempt.score}/{attempt.total} ({Math.round(attempt.accuracy_pct)}%)
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Time Taken</Text>
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    {formatTime(attempt.time_taken_sec)}
                  </Text>
                </View>
              </View>
              
              {/* Performance breakdown */}
              {(() => {
                const detailedAttempt = detailedAttempts.find(d => d.attemptId === attempt.attemptId);
                if (!detailedAttempt?.questions) return null;
                
                const correct = detailedAttempt.questions.filter(q => 
                  q.options.some(opt => opt.selected && opt.is_correct)
                ).length;
                const wrong = detailedAttempt.questions.filter(q => 
                  q.options.some(opt => opt.selected && !opt.is_correct)
                ).length;
                const unanswered = detailedAttempt.questions.filter(q => 
                  !q.options.some(opt => opt.selected)
                ).length;
                
                return (
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                    <View style={{ backgroundColor: "#10B981", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>✓ {correct}</Text>
                    </View>
                    <View style={{ backgroundColor: "#EF4444", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>✗ {wrong}</Text>
                    </View>
                    {unanswered > 0 && (
                      <View style={{ backgroundColor: "#F59E0B", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>— {unanswered}</Text>
                      </View>
                    )}
                  </View>
                );
              })()}
            </View>

            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>
              {formatIndianDate(attempt.submitted_at)} at {formatIndianTime(attempt.submitted_at)}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(main)/attempt/[attemptId]/review",
                  params: { attemptId: attempt.attemptId },
                })
              }
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>📋 Review Answers</Text>
            </TouchableOpacity>
          </View>
        ))}

        {attempts.length === 0 && (
          <View style={{ 
            backgroundColor: colors.card, 
            borderRadius: 12, 
            padding: 16, 
            borderWidth: 1, 
            borderColor: "#E2E8F0", 
            alignItems: "center" 
          }}>
            <Text style={{ color: colors.muted }}>No attempts yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}