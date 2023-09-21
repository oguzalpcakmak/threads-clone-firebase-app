import { useState } from "react";
import { View, Text, TextInput, SafeAreaView } from "../components/Themed";
import { Image } from "expo-image";
import {
  Switch,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { User } from "../types/threads";
import { updateUserData, uploadImage } from "../utils/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/auth";

import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";

export default function EditProfileScreen() {
  const user: User = JSON.parse(useLocalSearchParams().user);
  const setUser = useAuth().setUserData;

  const [username, setUsername] = useState<string>(user?.username || "");
  const [displayName, setDisplayName] = useState<string>(
    user?.displayName || ""
  );
  const [verified, setVerified] = useState<boolean>(user?.verified || false);
  const [photoURL, setPhotoURL] = useState<string>(user?.photoURL || "");
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [link, setLink] = useState<string>(user?.link || "");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const pickImage = async () => {
    try {
      setIsPicking(true);
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        setPhotoURL(result.assets[0].uri);
      }
      setIsPicking(false);
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error picking image");
    }
  };

  const handleUpdateButton = async () => {
    setProgress(0);
    setIsLoading(true);

    try {
      let mediaUrl = user.photoURL;

      if (photoURL !== "" && photoURL !== user.photoURL) {
        const fileName = `users/${
          user.uid
        }/IMG_${new Date().getTime()}_${Crypto.randomUUID()}.${photoURL
          .split(".")
          .pop()}`;
        const uploadResponse = await uploadImage(
          photoURL,
          fileName,
          setProgress,
          { Owner: user?.uid }
        );
        mediaUrl = uploadResponse.downloadUrl;
      }

      const res = await updateUserData(user.uid, {
        username,
        displayName,
        verified,
        photoURL: mediaUrl, // Use the updated mediaUrl
        bio,
        link,
      });

      if (res !== false) {
        setUser({ ...user, ...res });
      }

      router.push("/(tabs)/profile");
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert("Error updating profile");
    } finally {
      setIsLoading(false);
      setProgress(0);
      setPhotoURL("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Username:</Text>
        <TextInput
          value={username}
          onChangeText={(e) => setUsername(e)}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 8,
            marginBottom: 16,
          }}
        />
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Full Name:</Text>
        <TextInput
          value={displayName}
          onChangeText={(e) => setDisplayName(e)}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 8,
            marginBottom: 16,
          }}
        />
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Verified:</Text>
        <Switch value={verified} onValueChange={(e) => setVerified(e)} />
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Profile Photo:</Text>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {isPicking ? (
          <ActivityIndicator />
        ) : (
          photoURL !== "" && (
            <View>
              <Image
                source={{ uri: photoURL }}
                style={{ width: 200, height: 200, marginBottom: 16 }}
              />
              <Button
                onPress={() => {
                  setPhotoURL("");
                }}
                title="Remove Image"
              />
            </View>
          )
        )}
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Bio:</Text>
        <TextInput
          value={bio}
          onChangeText={(e) => setBio(e)}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 8,
            marginBottom: 16,
          }}
        />
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Link: </Text>
        <TextInput
          value={link}
          onChangeText={(e) => setLink(e)}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 8,
            marginBottom: 16,
          }}
        />
        {isLoading && (
          <View>
            {photoURL !== "" && (
              <Text>Image uploading {Math.floor(progress)}%</Text>
            )}
            <ActivityIndicator />
          </View>
        )}
        <Pressable
          onPress={handleUpdateButton}
          style={{
            backgroundColor: "blue",
            padding: 12,
            alignItems: "center",
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Update</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsLoading(true);
            router.push("/(tabs)/profile");
            setIsLoading(false);
          }}
          style={{
            backgroundColor: "red",
            padding: 12,
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Cancel</Text>
        </Pressable>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}
