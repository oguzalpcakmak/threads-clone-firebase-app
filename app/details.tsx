import { ReactNode } from "react";
import { SafeAreaView, Text, View } from "../components/Themed";
import {
  StyleSheet,
  useColorScheme,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { TimeData, timeAgo } from "../utils/time-ago";
import { Image } from "expo-image";
import { Reply, Thread } from "../types/threads";
import ReplyItem from "../components/ReplyItem";
import Colors from "../constants/Colors";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function DetailsScreen(): ReactNode {
  const thread: Thread = JSON.parse(useLocalSearchParams().thread);
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: Platform.select({ android: 30 }),
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          {({ pressed }) => (
            <Ionicons
              name="arrow-back-circle-outline"
              size={40}
              color={Colors[colorScheme ?? "light"].text}
              style={{
                paddingRight: 350,
                paddingBottom: 20,
                opacity: pressed ? 0.5 : 1,
              }}
            />
          )}
        </Pressable>
        <LiteThreadsItem {...thread} />
        <View>
          <Text
            style={{
              paddingLeft: 50,
              fontWeight: "bold",
              fontSize: 32,
            }}
          >
            Replies
          </Text>
          {thread.replies?.map((reply: Reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LiteThreadsItem(thread: Thread) {
  return (
    <View style={styles.outerContainer}>
      <PostLeftSide {...thread} />
      <View style={styles.threadRight}>
        <PostHeading
          name={thread.author.displayName}
          createdAt={thread.timestamp}
          verified={thread.author.verified}
        />
        <Text>{thread.content}</Text>
        {thread.image && (
          <Image
            source={thread.image}
            style={styles.imageContainer}
            placeholder={blurhash}
            contentFit="cover"
            transition={200}
          />
        )}
        <BottomIcons />
        <PostFooter
          repliesCount={thread.replies?.length || 0}
          likesCount={thread.likes?.length || 0}
        />
      </View>
    </View>
  );
}

function PostLeftSide(thread: Thread) {
  const currentTheme = useColorScheme();
  const borderColor = currentTheme === "light" ? "#00000020" : "#ffffff20";

  return (
    <View style={{ justifyContent: "space-between" }}>
      <Image
        source={{
          uri:
            thread.author.photoURL ||
            "https://cdn-icons-png.flaticon.com/128/149/149071.png",
        }}
        style={styles.image}
        placeholder={blurhash}
        contentFit="cover"
        transition={500}
      />
      <View
        style={{
          borderWidth: 1,
          alignSelf: "center",
          borderColor: borderColor,
          flexGrow: 1,
        }}
      />
      <View
        style={{
          width: 20,
          alignItems: "center",
          alignSelf: "center",
          gap: 3,
        }}
      >
        {[1, 2, 3].map((index) => (
          <Image
            key={index}
            source={{
              uri:
                (thread.replies
                  ? thread.replies[index - 1]?.author.photoURL
                  : null) ||
                "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
            style={{ width: index * 7, height: index * 7, borderRadius: 15 }}
            placeholder={blurhash}
            contentFit="cover"
            transition={500}
          />
        ))}
      </View>
    </View>
  );
}

function PostHeading({
  name,
  createdAt,
  verified,
}: {
  name: string;
  createdAt: TimeData;
  verified: boolean;
}) {
  return (
    <View>
      <View style={styles.miniContainer}>
        <Text style={styles.postHeadingName}>{name}</Text>
        {verified && (
          <MaterialIcons name="verified" size={14} color="#60a5fa" />
        )}
      </View>
      <View style={styles.miniContainer}>
        <Text style={styles.postHeadingDate}>{timeAgo(createdAt)}</Text>
        <Feather name="more-horizontal" size={14} color="gray" />
      </View>
    </View>
  );
}

function PostFooter({
  repliesCount,
  likesCount,
}: {
  repliesCount: number;
  likesCount: number;
}) {
  return (
    <Text style={styles.postFooter}>
      {`${repliesCount} replies · ${likesCount} likes`}
    </Text>
  );
}

function BottomIcons() {
  const iconSize = 20;
  const currentTheme = useColorScheme();
  const iconColor = currentTheme === "dark" ? "white" : "black";
  return (
    <View style={styles.miniContainer}>
      <FontAwesome name="heart-o" size={iconSize} color={iconColor} />
      <Ionicons name="chatbubble-outline" size={iconSize} color={iconColor} />
      <AntDesign name="retweet" size={iconSize} color={iconColor} />
      <Feather name="send" size={iconSize} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 10,
    borderWidth: 2,
    borderColor: "red",
  },
  threadRight: { gap: 6, flexShrink: 1 },
  container: { flexDirection: "row", gap: 6, paddingBottom: 30 },
  image: { width: 40, height: 40, borderRadius: 20 },
  postHeadingOuterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  miniContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  postHeadingName: {
    fontWeight: "500",
  },
  postHeadingDate: {
    color: "gray",
  },
  postFooter: { color: "gray" },
  imageContainer: { width: "100%", minHeight: 300, borderRadius: 10 },
});
