import { useEffect, useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../_layout.theme";
import api from "../../../src/api/client";

type NewsItem = { 
  title: string; 
  description?: string;
  source: string; 
  url: string; 
  published_at: string;
  url_to_image?: string;
};

const CATEGORIES = [
  { key: "general", label: "General", emoji: "📰" },
  { key: "business", label: "Business", emoji: "💼" },
  { key: "technology", label: "Tech", emoji: "💻" },
  { key: "sports", label: "Sports", emoji: "⚽" },
  { key: "health", label: "Health", emoji: "🏥" },
  { key: "science", label: "Science", emoji: "🔬" },
  { key: "entertainment", label: "Entertainment", emoji: "🎬" }
];

// Request limiting constants
const DAILY_REQUEST_LIMIT = 85; // Leave more buffer (15 requests)
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache (more conservative)
const MAX_CATEGORY_SWITCHES_PER_HOUR = 10; // Limit rapid category switching

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [error, setError] = useState<string | null>(null);

  // //console.log("[NEWS DEBUG] Component rendered, state:", {
  //   itemsCount: items.length,
  //   loading,
  //   selectedCategory,
  //   error
  // });

  // Check and update daily request count
  const checkRequestLimit = async (): Promise<boolean> => {
    const today = new Date().toDateString();
    const countKey = `news_requests_${today}`;
    
    try {
      const countStr = await AsyncStorage.getItem(countKey);
      const count = parseInt(countStr || "0");
      
      if (count >= DAILY_REQUEST_LIMIT) {
        setError("Daily news limit reached. Fresh news will be available tomorrow.");
        // //console.log(`[NEWS] Daily limit reached: ${count}/${DAILY_REQUEST_LIMIT}`);
        return false;
      }
      
      // Increment count
      await AsyncStorage.setItem(countKey, String(count + 1));
      // //console.log(`[NEWS] Daily requests: ${count + 1}/${DAILY_REQUEST_LIMIT}`);
      return true;
    } catch (error) {
      // console.error("Request limit check failed:", error);
      return true; // Allow request on error
    }
  };

  // Get cached news or fetch new
  const fetchNews = async (category: string) => {
    // //console.log(`[NEWS DEBUG] fetchNews called for category: ${category}`);
    try {
      setLoading(true);
      setError(null);
      //console.log("[NEWS DEBUG] Loading started, error cleared");
      
      // Check cache first
      const cacheKey = `news_cache_${category}`;
      const cacheStr = await AsyncStorage.getItem(cacheKey);
      //console.log(`[NEWS DEBUG] Cache check for ${cacheKey}:`, cacheStr ? "found" : "not found");
      
      if (cacheStr) {
        const cache = JSON.parse(cacheStr);
        const now = Date.now();
        //console.log(`[NEWS DEBUG] Cached data parsed:`, {
        //   articlesCount: cache.articles?.length || 0,
        //   timestamp: cache.timestamp,
        //   age: Math.floor((now - cache.timestamp) / 1000 / 60) + ' minutes',
        //   cacheValid: now - cache.timestamp < CACHE_DURATION,
        //   firstArticle: cache.articles?.[0]?.title
        // });
        
        if (now - cache.timestamp < CACHE_DURATION) {
          //console.log(`[NEWS DEBUG] Cache valid, setting items:`, cache.articles?.length);
          setItems(cache.articles || []);
          //console.log(`[NEWS DEBUG] setItems called with:`, cache.articles);
          setLoading(false);
          return;
        } else {
          //console.log(`[NEWS DEBUG] Cache expired, will fetch fresh data`);
        }
      }
      
      // Check request limit before API call
      const canRequest = await checkRequestLimit();
      if (!canRequest) {
        // Use cached data if available, even if expired
        if (cacheStr) {
          const cache = JSON.parse(cacheStr);
          setItems(cache.articles);
          setError("Using cached data - daily limit reached");
        } else {
          // Fallback data
          setItems([
            { title: "G20 Summit Highlights", source: "Press", url: "https://www.mea.gov.in/", published_at: new Date().toISOString() },
            { title: "RBI Monetary Policy Update", source: "RBI", url: "https://rbi.org.in/", published_at: new Date().toISOString() },
            { title: "Parliament Latest Bills", source: "PRS", url: "https://prsindia.org/billtrack", published_at: new Date().toISOString() },
          ]);
        }
        setLoading(false);
        return;
      }
      
      // Make API request
      //console.log(`[NEWS DEBUG] Making API request for ${category}`);
      const response = await api.get(`/news?category=${category}&page_size=15`);
      //console.log(`[NEWS DEBUG] API response status:`, response.status);
      //console.log(`[NEWS DEBUG] API response data:`, response.data);
      
      const articles = response.data.articles || [];
      //console.log(`[NEWS DEBUG] Articles extracted:`, articles.length);
      
      // Cache the results
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        articles,
        timestamp: Date.now()
      }));
      //console.log(`[NEWS DEBUG] Results cached for ${category}`);
      
      setItems(articles);
      //console.log(`[NEWS DEBUG] Items state updated with ${articles.length} articles`);
    } catch (err) {
      console.error('[NEWS DEBUG] API Error:', err);
      //console.log('[NEWS DEBUG] Error details:', JSON.stringify(err, null, 2));
      setError(err instanceof Error ? err.message : 'Failed to load news');
      
      // Try to use cached data on error
      const cacheKey = `news_cache_${category}`;
      const cacheStr = await AsyncStorage.getItem(cacheKey);
      //console.log(`[NEWS DEBUG] Fallback cache check:`, cacheStr ? "found" : "not found");
      
      if (cacheStr) {
        const cache = JSON.parse(cacheStr);
        setItems(cache.articles);
        setError("Using cached data - API error");
        //console.log(`[NEWS DEBUG] Using cached fallback: ${cache.articles.length} articles`);
      } else {
        // Fallback to placeholder data
        const fallbackData = [
          { title: "G20 Summit Highlights", source: "Press", url: "https://www.mea.gov.in/", published_at: new Date().toISOString() },
          { title: "RBI Monetary Policy Update", source: "RBI", url: "https://rbi.org.in/", published_at: new Date().toISOString() },
          { title: "Parliament Latest Bills", source: "PRS", url: "https://prsindia.org/billtrack", published_at: new Date().toISOString() },
        ];
        setItems(fallbackData);
        //console.log(`[NEWS DEBUG] Using fallback placeholder data: ${fallbackData.length} articles`);
      }
    } finally {
      setLoading(false);
      //console.log("[NEWS DEBUG] Loading finished, setLoading(false) called");
    }
  };

  useEffect(() => {
    //console.log(`[NEWS DEBUG] useEffect triggered for category: ${selectedCategory}`);
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  // Only for development - remove in production
  const clearCache = async () => {
    if (__DEV__) {  // Only available in development mode
      try {
        const keys = await AsyncStorage.getAllKeys();
        const newsKeys = keys.filter(key => key.startsWith('news_cache_'));
        await AsyncStorage.multiRemove(newsKeys);
        
        // Also clear request count to allow fresh API calls
        const today = new Date().toDateString();
        const countKey = `news_requests_${today}`;
        await AsyncStorage.removeItem(countKey);
        
        //console.log('[NEWS DEBUG] Cache and request count cleared, fetching fresh data');
        fetchNews(selectedCategory);
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  //console.log("[NEWS DEBUG] About to render, final state check:", {
  //   itemsLength: items.length,
  //   loading,
  //   error,
  //   firstItem: items[0]?.title
  // });

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>Current News</Text>
      
      {/* Debug Info - Only show in development */}
      {__DEV__ && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, color: colors.muted, flex: 1 }}>
            Debug: {items.length} items, loading: {loading.toString()}, error: {error || 'none'}
          </Text>
          <TouchableOpacity 
            onPress={clearCache} 
            style={{ 
              backgroundColor: colors.primary, 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 4 
            }}
          >
            <Text style={{ color: 'white', fontSize: 10 }}>Clear Cache</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={{ marginBottom: 16, maxHeight: 50 }}
        contentContainerStyle={{ paddingRight: 16, alignItems: 'center' }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => setSelectedCategory(cat.key)}
            style={{
              backgroundColor: selectedCategory === cat.key ? colors.primary : colors.card,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,
              marginRight: 8,
              borderWidth: 1,
              borderColor: selectedCategory === cat.key ? colors.primary : "#E2E8F0",
              minHeight: 36,
              justifyContent: 'center'
            }}
          >
            <Text style={{
              color: selectedCategory === cat.key ? "white" : colors.text,
              fontWeight: "600",
              fontSize: 13
            }}>
              {cat.emoji} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {error && (
        <View style={{ backgroundColor: "#fee", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <Text style={{ color: "#c33", fontWeight: "600" }}>⚠️ {error}</Text>
          <Text style={{ color: "#c33", marginTop: 4 }}>Showing placeholder data</Text>
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.muted, marginTop: 8 }}>Loading news...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.url + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.url)}
              style={{ 
                backgroundColor: colors.card, 
                borderRadius: 14, 
                marginBottom: 12, 
                borderWidth: 1, 
                borderColor: "#E2E8F0",
                overflow: 'hidden'
              }}
            >
              {/* Image Section */}
              {item.url_to_image && (
                <Image 
                  source={{ uri: item.url_to_image }}
                  style={{ 
                    width: '100%', 
                    height: 180, 
                    resizeMode: 'cover' 
                  }}
                  // onError={() => console.log('Image failed to load')}
                />
              )}
              
              {/* Content Section */}
              <View style={{ padding: 16 }}>
                <Text style={{ 
                  fontWeight: "700", 
                  color: colors.text, 
                  lineHeight: 22,
                  fontSize: 16
                }}>
                  {item.title}
                </Text>
                
                {item.description && (
                  <Text style={{ 
                    color: colors.muted, 
                    marginTop: 8, 
                    lineHeight: 20,
                    fontSize: 14 
                  }} numberOfLines={3}>
                    {item.description}
                  </Text>
                )}
                
                <View style={{ 
                  flexDirection: "row", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginTop: 12 
                }}>
                  <Text style={{ 
                    color: colors.muted, 
                    fontSize: 12,
                    flex: 1
                  }}>
                    {item.source} • {formatDate(item.published_at)}
                  </Text>
                  <Text style={{ 
                    color: colors.primary, 
                    fontWeight: "600",
                    fontSize: 13
                  }}>
                    Read ↗
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={() => fetchNews(selectedCategory)}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
