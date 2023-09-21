import {
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
  Pressable,
  useColorScheme,
} from "react-native";
import Lottie from "lottie-react-native";
import { useRef, useState, useEffect } from "react";
import ThreadsItem from "../../components/ThreadsItem";
import { View, SafeAreaView } from "../../components/Themed";
import { Link } from "expo-router";
import { Thread } from "../../types/threads";
import { db } from "../../utils/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export default function HomeScreen() {
  const animationRef = useRef<Lottie>(null);
  const [threads, setThreads] = useState<Thread[]>([]);

  const getThreads = async () => {
    const data = await getDocs(
      query(collection(db, "threads"), orderBy("timestamp", "desc"))
    );

    // Create an array of promises to fetch author data
    const authorPromises = data.docs.map(async (doc) => {
      const userData = await getAuthor(doc.data().uid);
      return {
        ...doc.data(),
        id: doc.id,
        author: userData,
      };
    });

    // Wait for all promises to resolve
    const threadsWithAuthors = await Promise.all(authorPromises);

    setThreads(threadsWithAuthors);
  };

  const getAuthor = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null; // Return null instead of undefined
  };

  useEffect(() => {
    getThreads();
    // console.log(threads);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: Platform.select({ android: 30 }),
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={"transparent"}
            onRefresh={() => {
              getThreads();
              animationRef.current?.play();
            }}
          />
        }
      >
        <View style={styles.centeredView}>
          <View style={styles.centeredView}>
            <Lottie
              ref={animationRef}
              source={require("../../lottie-animation/threads.json")}
              loop={false}
              style={styles.lottieContainer}
              autoPlay
            />
          </View>
        </View>
        {threads.map(
          (thread: Thread) =>
            thread.isShown && (
              <View key={thread.id}>
                <Link
                  href={{
                    pathname: "/details/",
                    params: { thread: JSON.stringify(thread) },
                  }}
                  asChild
                >
                  <Pressable>
                    {({ pressed }) => (
                      <ThreadsItem thread={thread} pressed={pressed} />
                    )}
                  </Pressable>
                </Link>
              </View>
            )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lottieContainer: {
    width: 90,
    height: 90,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1, // Occupy all available space within the container
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
  },
});
