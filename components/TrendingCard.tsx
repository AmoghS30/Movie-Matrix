import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: { id: movie_id.toString() },
      }}
      asChild
    >
      <TouchableOpacity className="w-32 pl-5 relative">
        {/* Poster Image */}
        <Image
          source={{ uri: poster_url }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        {/* Ranking Number Masked with Gradient */}
        <View className="absolute bottom-9 -left-3 px-2 py-1 rounded-full overflow-hidden">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              style={{ width: 56, height: 56 }} // fallback for size-14
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        {/* Movie Title */}
        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
