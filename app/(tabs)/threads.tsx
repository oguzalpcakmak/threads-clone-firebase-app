import { View, Text, TextInput } from "../../components/Themed";
import {
  ActivityIndicator,
  SafeAreaView,
  Button,
  Keyboard,
  Alert,
} from "react-native";
import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import { useAuth } from "../../context/auth";
import { db, uploadImage } from "../../utils/firebaseConfig";

export default function ThreadsScreen() {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPicking, setIsPicking] = useState<boolean>(false);

  // const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const user = useAuth().userData;

  const handlePostSubmit = async () => {
    if (content !== "") {
      setProgress(0);
      setIsLoading(true);
      const isWithImage = imageUri !== "";
      const res = addDoc(collection(db, "threads"), {
        uid: user?.uid,
        timestamp: serverTimestamp(),
        content,
        isShown: !isWithImage,
      });
      if (imageUri !== "") {
        const uploadThreadImage = async () => {
          const threadId = (await res).id;
          const fileName = `threads/${threadId}/IMG_${new Date().getTime()}_${Crypto.randomUUID()}.${imageUri
            .split(".")
            .pop()}`;
          const uploadResponse = await uploadImage(
            imageUri,
            fileName,
            setProgress,
            { Owner: user?.uid, Thread: threadId }
          );
          const downloadUrl = uploadResponse.downloadUrl;
          const threadRef = doc(db, "threads", threadId);
          await setDoc(
            threadRef,
            { image: downloadUrl, isShown: true },
            { merge: true }
          );
        };
        await uploadThreadImage();
      }
      setIsLoading(false);
      setProgress(0);
      setImageUri("");
      setContent("");
      Keyboard.dismiss();
    }
    setImageUri("");
    Keyboard.dismiss();
  };

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
        setImageUri(result.assets[0].uri);
      }
      setIsPicking(false);
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error picking image");
    }
  };

  //   const imageListRef = ref(storage, "images/");
  //   useEffect(() => {
  //     listAll(imageListRef).then((response) => {console.log(response)});
  //   }, []);

  // if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
  //   return (
  //     <View>
  //       <Text>Permission Not Granted - {permission?.status}</Text>
  //       <Button title="Request Permission" onPress={requestPermission}></Button>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          contentFit="contain"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
          source={{
            uri:
              user?.photoURL ||
              "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text>{user?.displayName || "unknown"}</Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
          multiline
        />
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {isPicking ? (
          <ActivityIndicator />
        ) : (
          imageUri !== "" && (
            <View>
              <Image
                source={{ uri: imageUri }}
                style={{ width: 200, height: 200 }}
              />
              <Button
                onPress={() => {
                  setImageUri("");
                }}
                title="Remove Image"
              />
            </View>
          )
        )}
      </View>

      <View style={{ marginTop: 20 }} />

      <Button onPress={handlePostSubmit} title="Share Post" />

      {isLoading && (
        <View>
          {imageUri !== "" && (
            <Text>Image uploading {Math.floor(progress)}%</Text>
          )}
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}
