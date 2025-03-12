import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Subheading, Title, Button } from "react-native-paper";
import { auth } from "../firebase/config";

const Settings = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const singOutUser = async () => {
    await signOut(auth);
    navigation.navigate("SignIn");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setName(user?.displayName ?? "");
      setEmail(user?.email ?? "");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Avatar.Text
        label={name.split(" ").reduce((prev, current) => prev + current[0], "")}
      />
      <Title>{name}</Title>
      <Subheading>{email}</Subheading>
      <Button onPress={singOutUser} uppercase>
        Sign Out
      </Button>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {},
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
});
