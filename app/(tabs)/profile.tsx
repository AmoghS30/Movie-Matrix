import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies, getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <View className="bg-dark-200 rounded-lg p-4 flex-1 mx-1">
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-light-300 text-sm">{title}</Text>
        <Text className="text-white text-2xl font-bold mt-1">{value}</Text>
      </View>
      <Image source={icon} className="size-8" tintColor="#AB8BFF" />
    </View>
  </View>
);

const Profile = () => {
  const { data: savedMovies = [], loading: savedLoading } =
    useFetch(getSavedMovies);

  const { data: trendingMovies = [], loading: trendingLoading } =
    useFetch(getTrendingMovies);

  // Calculate total searches from trending movies
  const totalSearches = Array.isArray(trendingMovies)
    ? trendingMovies.reduce(
        (sum: number, movie: TrendingMovie) => sum + movie.count,
        0
      )
    : 0;

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="w-full flex-row justify-center mt-20 items-center mb-8">
          <Image source={icons.logo} className="w-12 h-10" />
        </View>

        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="bg-accent rounded-full size-24 items-center justify-center mb-4">
            <Image source={icons.person} className="size-12" tintColor="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold">
            Movie Enthusiast
          </Text>
          <Text className="text-light-300 text-sm mt-1">
            Discovering great movies since 2024
          </Text>
        </View>

        {/* Stats Section */}
        <Text className="text-white text-lg font-bold mb-4">Your Stats</Text>

        {savedLoading || trendingLoading ? (
          <ActivityIndicator size="large" color="#AB8BFF" className="my-10" />
        ) : (
          <View className="flex-row mb-6">
            <StatCard
              title="Saved Movies"
              value={Array.isArray(savedMovies) ? savedMovies.length : 0}
              icon={icons.save}
            />
            <StatCard
              title="Total Searches"
              value={totalSearches}
              icon={icons.search}
            />
          </View>
        )}

        {/* Most Searched Movies */}
        {Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-4">
              Your Most Searched
            </Text>
            <View className="bg-dark-200 rounded-lg p-4">
              {trendingMovies
                .slice(0, 3)
                .map((movie: TrendingMovie, index: number) => (
                  <View
                    key={movie.movie_id}
                    className="flex-row items-center justify-between py-3 border-b border-dark-100 last:border-b-0"
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="text-accent text-lg font-bold w-6">
                        {index + 1}
                      </Text>
                      <Image
                        source={{ uri: movie.poster_url }}
                        className="size-12 rounded-md ml-3"
                        resizeMode="cover"
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          className="text-white font-semibold"
                          numberOfLines={1}
                        >
                          {movie.title}
                        </Text>
                        <Text className="text-light-300 text-sm">
                          {movie.count} search{movie.count !== 1 ? "es" : ""}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Settings Section */}
        <Text className="text-white text-lg font-bold mb-4">Settings</Text>
        <View className="bg-dark-200 rounded-lg">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-dark-100">
            <View className="flex-row items-center">
              <Image
                source={icons.star}
                className="size-5 mr-3"
                tintColor="#AB8BFF"
              />
              <Text className="text-white font-medium">Rate App</Text>
            </View>
            <Image
              source={icons.arrow}
              className="size-4"
              tintColor="#A8B5DB"
            />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-dark-100">
            <View className="flex-row items-center">
              <Image
                source={icons.person}
                className="size-5 mr-3"
                tintColor="#AB8BFF"
              />
              <Text className="text-white font-medium">Account Settings</Text>
            </View>
            <Image
              source={icons.arrow}
              className="size-4"
              tintColor="#A8B5DB"
            />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Image
                source={icons.home}
                className="size-5 mr-3"
                tintColor="#AB8BFF"
              />
              <Text className="text-white font-medium">About</Text>
            </View>
            <Image
              source={icons.arrow}
              className="size-4"
              tintColor="#A8B5DB"
            />
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text className="text-center text-light-300 text-sm mt-8">
          MovieMatrix v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default Profile;
