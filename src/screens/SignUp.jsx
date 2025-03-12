import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Subheading, TextInput } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";

const SignUp = ({ navigation }) => {
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onChange = (key, value) => {
    setformData((prev) => ({ ...prev, [key]: value }));
  };

  const createAccount = async () => {
    setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(response.user, { displayName: formData.name });
      navigation.navigate("Main", { screen: "ChatList" });
    } catch (error) {
      setIsError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <View
      style={{
        padding: 16,
        gap: 15,
      }}
    >
      {isError && (
        <Subheading style={{ color: "red", textAlign: "center" }}>
          {isError}
        </Subheading>
      )}
      <TextInput
        required
        value={formData.name}
        onChangeText={(text) => onChange("name", text)}
        label={"Name"}
      />
      <TextInput
        required
        value={formData.email}
        onChangeText={(text) => onChange("email", text)}
        label={"Email"}
        keyboardType="email-address"
      />
      <TextInput
        secureTextEntry
        required
        value={formData.password}
        onChangeText={(text) => onChange("password", text)}
        label={"Password"}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button onPress={() => navigation.navigate("SignIn")} compact={true}>
          Sign In
        </Button>
        <Button loading={isLoading} onPress={createAccount} mode="contained">
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
