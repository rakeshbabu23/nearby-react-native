import { StyleSheet, Text, View, Modal, Button } from "react-native";
import React from "react";

const GeneralModal = ({ children, modalVisible, setModalVisible }) => {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text>Hello</Text>
        </View>
        <Button title="close" onPress={() => setModalVisible(false)} />
      </View>
    </Modal>
  );
};

export default GeneralModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Poppins-Medium",
    color: "black",
  },
});
