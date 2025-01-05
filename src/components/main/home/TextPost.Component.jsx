import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
const str = `lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitaeultricies lectus. Donec facilisis, mauris in consectetur ultricies,felis lectus fermentum velit, vitae fermentum urna ipsum id lectus.Vestibulum consectetur, orci ut consectetur aliquet, mauris nunc euismodjusto, vel interdum lorem metus in nisi. Proin non viverra lectus, atultricies felis. Nulla facilisi velit, euismod at turpis ac, commodofermentum justo. Sed viverra, nunc vel cursus rutrum, justo eratullamcorper nunc, sed vulputate velit turpis in velit. Donec convallis,nisl ac ultrices pulvinar, ligula nunc faucibus nunc, non fermentummetus nisi id mauris. Sed ultricies consequat lorem, ac tempor enimsollicitudin at. Integer`;
const TextPost = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.author}>Rakesh</Text>
      <Text style={styles.content}>
        {str.length > 50 ? str.slice(0, 50) : str}
      </Text>
    </View>
  );
};

export default TextPost;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(20),
    width: (Dimensions.get("window").width * 0.95) / 2,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(2),
    flexDirection: "column",
    alignItems: "flex-start",
    borderWidth: 1,
    margin: 2,
  },
  author: {
    fontSize: responsiveWidth(5),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  content: {
    fontSize: responsiveWidth(3),
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
});
