"use client";

import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import { isMovieSaved, saveMovie, unsaveMovie } from "@/services/appwrite";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  ...movieData
}: Movie) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [id]);

  const checkIfSaved = async () => {
    try {
      const saved = await isMovieSaved(id);
      setIsSaved(saved);
    } catch (error) {
      console.error("Error checking if movie is saved:", error);
    }
  };

  const handleSaveToggle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isSaved) {
        await unsaveMovie(id);
        setIsSaved(false);
      } else {
        await saveMovie({
          id,
          poster_path,
          title,
          vote_average,
          release_date,
          ...movieData,
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-[30%]">
      <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />

          <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
            {title}
          </Text>

          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date?.split("-")[0]}
            </Text>
            <Text className="text-xs font-medium text-light-300 uppercase">
              Movie
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        onPress={handleSaveToggle}
        disabled={loading}
        className={`absolute top-2 right-2 rounded-full p-1 ${
          isSaved ? "bg-accent" : "bg-dark-200"
        }`}
      >
        <Image
          source={icons.save}
          className="size-4"
          tintColor={isSaved ? "#fff" : "#A8B5DB"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MovieCard;
