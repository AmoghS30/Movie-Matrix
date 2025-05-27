"use client";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";

import SavedMovieCard from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

const Saved = () => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: savedMovies = [],
    loading,
    error,
    refetch,
  } = useFetch(getSavedMovies, false);

  // Refresh saved movies when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleUnsave = () => {
    refetch(); // Refresh the list after unsaving
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="flex-1 px-5"
        data={Array.isArray(savedMovies) ? savedMovies : []}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <SavedMovieCard {...item} onUnsave={handleUnsave} />
        )}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 8,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#AB8BFF"
          />
        }
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center mb-5">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <Text className="text-2xl text-white font-bold mb-5">
              Saved Movies
            </Text>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                className="my-10"
              />
            )}

            {error && (
              <Text className="text-red-500 text-center my-5">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              Array.isArray(savedMovies) &&
              savedMovies.length > 0 && (
                <Text className="text-light-200 text-sm mb-5">
                  {savedMovies.length} movie
                  {savedMovies.length !== 1 ? "s" : ""} saved
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="flex-1 justify-center items-center mt-20">
              <Image
                source={icons.save}
                className="size-16 mb-4"
                tintColor="#A8B5DB"
              />
              <Text className="text-center text-light-200 text-lg font-semibold">
                No Saved Movies
              </Text>
              <Text className="text-center text-light-300 text-sm mt-2 px-8">
                Start saving movies you want to watch later by tapping the save
                button on any movie.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Saved;
