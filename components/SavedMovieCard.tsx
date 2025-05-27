import { icons } from "@/constants/icons";
import { unsaveMovie } from "@/services/appwrite";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface SavedMovieCardProps extends SavedMovie {
  onUnsave: () => void;
}

const SavedMovieCard = ({
  movie_id,
  poster_url,
  title,
  vote_average,
  release_date,
  onUnsave,
}: SavedMovieCardProps) => {
  const handleUnsave = async () => {
    try {
      await unsaveMovie(movie_id);
      onUnsave();
    } catch (error) {
      console.error("Error unsaving movie:", error);
    }
  };

  return (
    <View className="w-[30%]">
      <Link href={`/movies/${movie_id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri:
                poster_url || "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
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
        onPress={handleUnsave}
        className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
      >
        <Text className="text-white text-xs font-bold px-2">Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SavedMovieCard;
