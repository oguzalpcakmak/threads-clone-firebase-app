import { Thread, User } from "../types/threads";
import { ReactNode, useEffect, useState } from "react";
import { Text, View } from "./Themed";
import { StyleSheet, useColorScheme } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { TimeData, timeAgo } from "../utils/time-ago";
import { Image } from "expo-image";
import { useAuth } from "../context/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useViewportUnits } from "../utils/viewport-hook";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ThreadsItem({
  thread,
  pressed,
}: {
  thread: Thread;
  pressed: boolean;
}): ReactNode {
  const { vh, vw } = useViewportUnits();
  const height = 40 * vh;
  const width = 80 * vw;

  return (
    <View style={{ ...styles.outerContainer, opacity: pressed ? 0.5 : 1 }}>
      <PostLeftSide {...thread} />
      <View style={styles.threadRight}>
        <PostHeading
          name={thread.author?.displayName || "undefined"}
          createdAt={thread.timestamp}
          verified={thread.author?.verified || false}
        />
        <Text>{thread.content}</Text>
        {thread.image && (
          <Image
            source={thread.image}
            style={{ width, height, borderRadius: 10 }}
            placeholder={blurhash}
            contentFit="cover"
            transition={200}
          />
        )}
        <BottomIcons threadId={thread.id} threadLikes={thread.likes || []} />
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
                  ? thread.replies[index - 1].author.photoURL
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

function BottomIcons({
  threadId,
  threadLikes,
}: {
  threadId: string;
  threadLikes: User[];
}) {
  const { user } = useAuth();
  const iconSize = 20;
  const currentTheme = useColorScheme();
  const iconColor = currentTheme === "dark" ? "white" : "black";
  const handleLike = async () => {
    console.log(`liked post id: ${threadId}`);
  };

  const handleDislike = async () => {
    console.log(`disliked post id: ${threadId}`);
  };
  return (
    <View style={styles.miniContainer}>
      {/* {threadLikes?.includes(user?.uid) ? ( */}
      {Math.random() >= 0.5 ? (
        <FontAwesome
          onPress={() => handleDislike()}
          name="heart"
          size={iconSize}
          color="red"
        />
      ) : (
        <FontAwesome
          onPress={() => handleLike()}
          name="heart-o"
          size={iconSize}
          color={iconColor}
        />
      )}
      <Ionicons name="chatbubble-outline" size={iconSize} color={iconColor} />
      <AntDesign name="retweet" size={iconSize} color={iconColor} />
      <Feather name="send" size={iconSize} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flexDirection: "row", gap: 6, paddingBottom: 30 },
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
