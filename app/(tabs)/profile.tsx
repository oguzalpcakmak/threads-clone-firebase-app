import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useAuth } from "../../context/auth";
import { Link } from "expo-router";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const user = useAuth().userData;

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {/*user?.name*/}
            {user?.displayName || "unknown"}
          </Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Threads.net</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              contentFit="contain"
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
              }}
              source={{
                uri:
                  user?.photoURL ||
                  "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>

          <View style={{ width: 200 }}>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {user?.bio || "empty"}
            </Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {/* {user?.followers?.length} followers */}
          {Math.floor(Math.random() * 1000)} followers
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Link
            href={{
              pathname: "/edit-profile/",
              params: {
                user: JSON.stringify(user),
              },
            }}
            asChild
          >
            <Pressable
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <Text>Edit Profile</Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={signOut}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
