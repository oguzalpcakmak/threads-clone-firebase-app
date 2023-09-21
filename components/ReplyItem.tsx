import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { View, Text } from "./Themed";
import { Image } from "expo-image";
import { Reply } from "../types/threads";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const tweetActions = (retweets: number, comments: number, likes: number) => {
  const theme = useColorScheme();

  return (
    <View style={[styles.rowActions, styles.actionBar]}>
      <View style={styles.elemAction}>
        <EvilIcons
          style={styles.actionButton}
          name="comment"
          size={21}
          color={theme === "dark" ? "gray" : "#000"}
        />
        <Text style={styles.actionText}>{comments}</Text>
      </View>
      <View style={styles.elemAction}>
        <EvilIcons
          style={styles.actionButton}
          name="retweet"
          size={22}
          color={theme === "dark" ? "gray" : "#000"}
        />
        <Text style={styles.actionText}>{retweets}</Text>
      </View>
      <View style={styles.elemAction}>
        <EvilIcons
          style={styles.actionButton}
          name="heart"
          size={21}
          color={theme === "dark" ? "gray" : "#000"}
        />
        <Text style={styles.actionText}>{likes}</Text>
      </View>
      <EvilIcons
        style={styles.actionButton}
        name="share-apple"
        size={23}
        color={theme === "dark" ? "gray" : "#000"}
      />
    </View>
  );
};

const GrayText = ({
  children,
  numberOfLines,
  style,
}: {
  children: PropsWithChildren;
  numberOfLines: number;
  style: object;
}): ReactNode => {
  return (
    <Text style={[style, styles.gray]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const ReplyItem = ({ reply }: { reply: Reply }) => {
  const theme = useColorScheme();
  return (
    <View style={styles.singleItem}>
      <View style={styles.row}>
        <Image
          source={{
            uri:
              reply.author.photoURL ||
              "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
          style={styles.avatar}
          placeholder={blurhash}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.tweetContentContainer}>
          <View style={styles.rowTop}>
            <Text
              numberOfLines={1}
              style={[
                styles.header,
                { color: theme === "dark" ? "#FFF" : "#000" },
              ]}
            >
              {reply.author.displayName}
            </Text>
            <GrayText style={styles.author} numberOfLines={1}>
              @{reply.author.username}
            </GrayText>
            <GrayText>·</GrayText>
            <GrayText>2h</GrayText>
          </View>
          <Text
            style={[
              styles.description,
              { color: theme === "dark" ? "#FFF" : "#000" },
            ]}
          >
            {reply.content}
          </Text>
          <View style={styles.rowActions}>
            {tweetActions(
              Math.floor(Math.random() * 1000),
              Math.floor(Math.random() * 1000),
              reply.likes?.length || 0
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  author: {
    flexShrink: 1,
  },
  actionBar: {
    marginTop: 8,
    justifyContent: "space-between",
    marginRight: 16,
  },
  actionButton: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  gray: {
    color: "#777",
    fontSize: 13,
    paddingRight: 2,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    marginRight: 16,
    flexShrink: 0,
    marginTop: 4,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 4,
    paddingRight: 4,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#000",
  },
  singleItem: {
    marginHorizontal: 16,
    minHeight: 44,
    padding: 16,
  },
  rowTop: {
    flexDirection: "row",
  },
  rowActions: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  elemAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  actionText: {
    fontSize: 12,
    color: "#444",
  },
  tweetContentContainer: {
    flexShrink: 1,
    flexGrow: 1,
  },
  image: { width: 40, height: 40, borderRadius: 20 },
});

export default ReplyItem;
