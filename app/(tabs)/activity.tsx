import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";

import User from "../../components/UserItem";

export default function ActivityScreen() {
  const [selectedButton, setSelectedButton] = useState("people");
  const [content, setContent] = useState("People Content");
  const [users, setUsers] = useState([]);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  // console.log("users", users);

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => handleButtonClick("people")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "people" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "people"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              People
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("all")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "all" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "all"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("requests")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "requests"
                ? { backgroundColor: "black" }
                : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "requests"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              Requests
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {selectedButton === "people" && (
            <View style={{ marginTop: 20 }}>
              {users?.map((item, index) => (
                <User key={index} item={item} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
