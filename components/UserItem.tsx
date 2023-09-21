import { Text, View, Pressable } from "react-native";
import { useState, useEffect, PropsWithChildren } from "react";
import { Image } from "expo-image";
import { useAuth } from "../context/auth";

export default function UserItem({ item }: { item: PropsWithChildren }) {
  const { user } = useAuth();
  console.log("sds", item);
  const [requestSent, setRequestSent] = useState(false);
  const sendFollow = async (currentUserId: string, selectedUserId: string) => {
    console.log(
      `User with ID ${currentUserId} sucessfully followed user with ID ${selectedUserId}.`
    );
  };

  const handleUnfollow = async (targetId: string) => {
    console.log(`Successfully unfollowed user with ID ${targetId}.`);
  };
  useEffect(() => {
    // Reset the requestSent state whenever the userId or item prop changes
    setRequestSent(false);
  }, [user?.uid, item]);
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          contentFit="contain"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text style={{ fontSize: 15, fontWeight: "500", flex: 1 }}>
          {item?.name}
        </Text>

        {requestSent || item?.followers?.includes(user?.uid) ? (
          <Pressable
            onPress={() => handleUnfollow(item?._id)}
            style={{
              borderColor: "#D0D0D0",
              borderWidth: 1,
              padding: 10,
              marginLeft: 10,
              width: 100,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
            >
              Following
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFollow(user?.uid, item._id)}
            style={{
              borderColor: "#D0D0D0",
              borderWidth: 1,
              padding: 10,
              marginLeft: 10,
              width: 100,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
            >
              Follow
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
