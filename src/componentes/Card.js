import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Card({ titulo, children, action }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{titulo}</Text>
        {action && <View style={styles.action}>{action}</View>}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 5
  },
  title: { fontSize: 18, fontWeight: "bold" },
  action: { marginLeft: 10 },
  content: {},
});
